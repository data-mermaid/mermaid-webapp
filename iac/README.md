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

1. `index.ts` attaches the `AwsSolutionsChecks` aspect to the CDK app.
2. During `cdk synth`, cdk-nag inspects every resource and reports errors/warnings.
3. `nag-suppressions.ts` contains **stack-level** suppressions for findings that have been triaged — each one is tagged with a reason and status via `applyNagSuppressions()`.
4. The PR workflow (`pr.yml`) runs `cdk synth`, posts the results as a PR comment, and **fails the check** if any unsuppressed errors exist.

### Adding a suppression

When cdk-nag flags a new resource:

1. Decide whether the finding should be **fixed** (change infra code) or **suppressed** (accepted risk / future TODO).
2. If suppressing, add an entry in `nag-suppressions.ts` inside `applyNagSuppressions()`.
3. Tag the reason with `ACCEPTED` (intentional) or `TODO` (to be addressed later).
4. Run `cdk synth` locally to confirm the error is resolved.

### Running locally

Check for unsuppressed Error-level findings:

```bash
cd iac && npx cdk synth --quiet 2>&1 | tee /tmp/cdk-nag.log && grep '^\[Error' /tmp/cdk-nag.log
```

No `[Error` output means all Error-level findings are suppressed. Warnings may still appear.
