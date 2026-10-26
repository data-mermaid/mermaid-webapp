# Welcome to your CDK TypeScript project

This is a blank project for CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

- `npm run build` compile typescript to js
- `npm run watch` watch for changes and compile
- `npm run test` perform the jest unit tests
- `cdk deploy` deploy this stack to your default AWS account/region
- `cdk diff` compare deployed stack with current state
- `cdk synth` emits the synthesized CloudFormation template

## cdk-nag

[cdk-nag](https://github.com/cdklabs/cdk-nag) runs `AwsSolutionsChecks` during every `cdk synth`. It validates all stacks against the [AWS Solutions](https://github.com/cdklabs/cdk-nag/blob/main/RULES.md#awssolutions) rule pack and reports errors and warnings for any findings.

### How it works

1. `index.ts` registers `AwsSolutionsChecks` as a CDK policy validation plugin (`Validations.of(app).addPlugins(...)`, cdk-nag v3).
2. During `cdk synth`, cdk-nag inspects every resource. Any unacknowledged finding, error **or warning**, makes `cdk synth` exit non-zero and is listed in `cdk.out/validation-report.json`.
3. `nag-suppressions.ts` acknowledges findings that have been triaged (`Validations.of(construct).acknowledge(...)`). Each one is tagged with a reason and status via `applyNagSuppressions()`.
4. The PR workflow (`pr.yml`) runs `cdk synth`, posts the findings from `validation-report.json` as a PR comment, and **fails the check** if there are any.

### Adding an acknowledgment (suppression)

When cdk-nag flags a new resource:

1. Decide whether the finding should be **fixed** (change infra code) or **acknowledged** (accepted risk / future TODO).
2. If acknowledging, add an entry in `nag-suppressions.ts` inside `applyNagSuppressions()`.
   - Granular rules (e.g. `AwsSolutions-IAM5`) report one finding per wildcard. List each in `appliesTo`. v3 matches the exact `RuleId[finding]` string (copy it from the report), with no regex support.
3. Tag the reason with `ACCEPTED` (intentional) or `TODO` (to be addressed later).
4. Run `cdk synth` locally to confirm the finding is gone.

### Running locally

```bash
cd iac && npx cdk synth --quiet; jq '[.pluginReports[].violations[].ruleName]' cdk.out/validation-report.json
```

`cdk synth` exits non-zero and prints the findings if any are unacknowledged. The `jq` command lists their rule IDs; `[]` means none.
