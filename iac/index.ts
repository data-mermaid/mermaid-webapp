#!/usr/bin/env node
/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
/* eslint-disable no-new */
import * as cdk from 'aws-cdk-lib'
import { Aspects } from 'aws-cdk-lib'
import { AwsSolutionsChecks } from 'cdk-nag'
import { StaticSiteStack } from './stacks/static-site-stack'
import { applyNagSuppressions } from './nag-suppressions'

const app = new cdk.App()
Aspects.of(app).add(new AwsSolutionsChecks({ verbose: true }))

const tags = {
  Owner: 'sysadmin@datamermaid.org',
}

const subdomain = app.node.tryGetContext('subdomain') || 'dev'
const domain = app.node.tryGetContext('domain') || 'app2.datamermaid.org'
const hostedZoneId = app.node.tryGetContext('hostedZoneId') || 'Z057628713VX646WVHWOJ'

const cdkEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION || 'us-east-1',
}

const stack = new StaticSiteStack(app, `${subdomain}-webapp`, {
  env: cdkEnv,
  tags,
  domainName: domain,
  siteSubDomain: subdomain,
  hostedZoneId,
})

applyNagSuppressions(stack)

app.synth()
