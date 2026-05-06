#!/usr/bin/env bash
set -euo pipefail

CDK_SUBDOMAIN="${CDK_SUBDOMAIN:-dev}"
STACK_NAME="${CDK_STACK_NAME:-${CDK_SUBDOMAIN}-webapp}"

function run_cdk_diff(){
	echo "Run cdk diff"
	set +e
	npx cdk diff "${STACK_NAME}" -c "subdomain=${CDK_SUBDOMAIN}" 2>&1 | tee /tmp/cdk-diff.log
	exitCode=${?}
	set -e

	if [ "${exitCode}" != "0" ]; then
		echo "CDK diff has failed. See above console output for more details."
		exit 1
	fi
}

run_cdk_diff
