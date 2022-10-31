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

interface StaticSiteStackProps extends cdk.StackProps {
  domainName: string;
  siteSubDomain: string;
}

class StaticSiteStack extends cdk.Stack {
    constructor(parent: cdk.App, name: string, props: StaticSiteStackProps) {
        super(parent, name, props)

        new StaticSite(this, 'StaticSite', {
            domainName: props.domainName,
            siteSubDomain: props.siteSubDomain,
        })
    }
}

const app = new cdk.App()

const tags = {
  "Owner": "sysadmin@datamermaid.org",
}

const subdomain = app.node.tryGetContext('subdomain') || 'dev'
const domain = app.node.tryGetContext('domain') || 'app2.datamermaid.org'

const cdkEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION || 'us-east-1',
}

new StaticSiteStack(app, `${subdomain}-webapp`, {
    env: cdkEnv,
    tags,
    domainName: domain,
    siteSubDomain: subdomain
})

new StaticSiteStack(app, `preview-webapp`, {
  env: cdkEnv,
  tags,
  domainName: domain,
  siteSubDomain: "preview",
})

app.synth()
