#!/usr/bin/env node
/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
/* eslint-disable no-new */
import * as cdk from 'aws-cdk-lib'
import { StaticSite } from './static-site'

/**
 * This stack relies on getting the domain name from CDK context.
 * Use 'cdk [--profile mermaid] synth -c domain=app2.datamermaid.org -c subdomain=dev'
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

const app = new cdk.App()

const tags = {
  "Owner": "sysadmin@datamermaid.org",
}
const siteSubDomain = app.node.tryGetContext('subdomain') || 'dev'

const cdkEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION || 'us-east-1',
}

new StaticSiteStack(app, `${siteSubDomain}-webapp`, {
    env: cdkEnv,
    tags,
})

app.synth()
