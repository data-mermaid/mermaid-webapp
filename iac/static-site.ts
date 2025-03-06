#!/usr/bin/env node
/* eslint-disable no-new */
import * as route53 from 'aws-cdk-lib/aws-route53'
import * as s3 from 'aws-cdk-lib/aws-s3'
import * as acm from 'aws-cdk-lib/aws-certificatemanager'
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront'
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment'
import * as targets from 'aws-cdk-lib/aws-route53-targets'
import * as cloudfront_origins from 'aws-cdk-lib/aws-cloudfront-origins'
import { CfnOutput, RemovalPolicy, Stack } from 'aws-cdk-lib'
import * as iam from 'aws-cdk-lib/aws-iam'
import { Construct } from 'constructs'

export interface StaticSiteProps {
  domainName: string
  siteSubDomain: string
  hostedZoneId: string
  isPreview?: boolean
}

/**
 * Static site infrastructure, which deploys site content to an S3 bucket.
 *
 * The site redirects from HTTP to HTTPS, using a CloudFront distribution,
 * Route53 alias record, and ACM certificate.
 */
export class StaticSite extends Construct {
  bucket: s3.Bucket

  constructor(parent: Stack, name: string, props: StaticSiteProps) {
    super(parent, name)

    const zone = route53.HostedZone.fromHostedZoneAttributes(this, 'Zone', {
      hostedZoneId: props.hostedZoneId,
      zoneName: props.domainName,
    })

    const siteDomain = `${props.siteSubDomain}.${props.domainName}`
    const cloudfrontOAI = new cloudfront.OriginAccessIdentity(this, 'CloudfrontOAI', {
      comment: `OAI for ${name}`,
    })

    new CfnOutput(this, 'Site', { value: `https://${siteDomain}` })

    // Content bucket
    const siteBucket = new s3.Bucket(this, 'Bucket', {
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      bucketName: siteDomain,

      /**
       * The default removal policy is RETAIN, which means that cdk destroy will not attempt to delete
       * the new bucket, and it will remain in your account until manually deleted. By setting the policy to
       * DESTROY, cdk destroy will attempt to delete the bucket, but will error if the bucket is not empty.
       */
      removalPolicy: props.siteSubDomain === 'dev' ? RemovalPolicy.DESTROY : RemovalPolicy.RETAIN,

      /**
       * For sample purposes only, if you create an S3 bucket then populate it, stack destruction fails.  This
       * setting will enable full cleanup.
       */
      autoDeleteObjects: props.siteSubDomain === 'dev',
    })

    // Grant access to cloudfront
    siteBucket.addToResourcePolicy(
      new iam.PolicyStatement({
        actions: ['s3:GetObject'],
        resources: [siteBucket.arnForObjects('*')],
        principals: [
          new iam.CanonicalUserPrincipal(
            cloudfrontOAI.cloudFrontOriginAccessIdentityS3CanonicalUserId,
          ),
        ],
      }),
    )
    new CfnOutput(this, 'BucketName', { value: siteBucket.bucketName })

    // TLS certificate
    // NOTE: This depends on the cert already created (manually)
    const certificate = acm.Certificate.fromCertificateArn(
      this,
      'DefaultSSLCert',
      `arn:aws:acm:us-east-1:${parent.account}:certificate/783d7a91-1ebd-4387-9518-e28521086db6`,
    )

    // CloudFront distribution
    const domainNames = [siteDomain]

    // allow the prod/preview domains into the cloudfront distribution
    if (props.siteSubDomain === 'dev') {
      domainNames.push('dev-app.datamermaid.org')
    }
    if (props.siteSubDomain === 'prod') {
      domainNames.push('app.datamermaid.org')
    }
    if (props.siteSubDomain === 'preview') {
      domainNames.push('preview.datamermaid.org')
    }
    const distribution = new cloudfront.Distribution(this, 'Distribution', {
      certificate,
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
      defaultRootObject: 'index.html',
      domainNames,
      minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
      // if you do a hard refresh, then the app goes to an error page. We need it to
      // redirect to index.html
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
        },
      ],
      defaultBehavior: {
        cachePolicy: props.isPreview
          ? cloudfront.CachePolicy.CACHING_DISABLED
          : cloudfront.CachePolicy.CACHING_OPTIMIZED,
        origin: new cloudfront_origins.S3StaticWebsiteOrigin(siteBucket),
        compress: true,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
    })

    new CfnOutput(this, 'DistributionId', { value: distribution.distributionId })

    // Route53 alias record for the CloudFront distribution
    new route53.ARecord(this, 'AliasRecord', {
      recordName: siteDomain,
      target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution)),
      zone,
    })

    // Deploy site contents to S3 bucket
    let s3Asset = s3deploy.Source.asset('../build')

    if (props.siteSubDomain === 'preview') {
      s3Asset = s3deploy.Source.asset('../preview')
    }
    new s3deploy.BucketDeployment(this, 'DeployWithInvalidation', {
      sources: [s3Asset],
      destinationBucket: siteBucket,
      distribution,
      distributionPaths: ['/*'],
    })

    // export
    this.bucket = siteBucket
  }
}
