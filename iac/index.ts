#!/usr/bin/env node
/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
/* eslint-disable no-new */
import * as cdk from 'aws-cdk-lib'
import { StaticSite } from './static-site'

/**
 * This stack relies on getting the domain name from CDK context.
 * Use 'cdk --profile mermaid synth -c domain=app2.datamermaid.org -c subdomain=dev -c accountId=1234567890'
**/
class StaticSiteStack extends cdk.Stack {
    constructor(parent: cdk.App, name: string, props: cdk.StackProps) {
        super(parent, name, props)

        new StaticSite(this, 'StaticSite', {
            domainName: this.node.tryGetContext('domain'),
            siteSubDomain: this.node.tryGetContext('subdomain'),
        })
    }
}

const tags = {
  "Owner": "sysadmin@datamermaid.org",
}

const app = new cdk.App()

const cdkEnv = {
  account: app.node.tryGetContext('accountId'),
  /**
   * Stack must be in us-east-1, because the ACM certificate for a
   * global CloudFront distribution must be requested in us-east-1.
   */
  region: 'us-east-1',
}

new StaticSiteStack(app, 'Webapp', {
    /**
     * env is required for our use of hosted-zone lookup.
     *
     * Lookups do not work at all without an explicit environment
     * specified; to use them, you must specify env.
     * @see https://docs.aws.amazon.com/cdk/latest/guide/environments.html
     */
    env: cdkEnv,
    tags,
})

app.synth()
