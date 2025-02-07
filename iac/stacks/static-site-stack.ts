#!/usr/bin/env node
/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
/* eslint-disable no-new */
import * as cdk from 'aws-cdk-lib'
import * as iam from 'aws-cdk-lib/aws-iam'
import { StaticSite } from '../static-site'

/**
 * This stack relies on getting the domain name from CDK context.
 * Use 'cdk [--profile mermaid] synth -c domain=app2.datamermaid.org -c subdomain=dev'
 **/

interface StaticSiteStackProps extends cdk.StackProps {
  domainName: string
  siteSubDomain: string
  isPreview?: boolean
}

export class StaticSiteStack extends cdk.Stack {
  constructor(parent: cdk.App, name: string, props: StaticSiteStackProps) {
    super(parent, name, props)

    const site = new StaticSite(this, 'StaticSite', {
      domainName: props.domainName,
      siteSubDomain: props.siteSubDomain,
      isPreview: props.isPreview,
    })

    if (props.isPreview) {
      // allow CICD_Bot to delete/create PR subfolders in the bucket
      const cicd_bot = iam.User.fromUserName(this, 'User', 'CICD_Bot')

      site.bucket.grantReadWrite(cicd_bot)
    }
  }
}
