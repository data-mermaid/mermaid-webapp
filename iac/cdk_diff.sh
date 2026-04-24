#!/usr/bin/env bash
set -euo pipefail

STACK_NAME="${CDK_STACK_NAME:-dev-webapp}"

function diff(){
	echo "Run cdk diff"
	set +e
	npx cdk diff "${STACK_NAME}" 2>&1 | tee /tmp/cdk-diff.log
	exitCode=${?}
	set -e

	if [ "${exitCode}" != "0" ]; then
		echo "CDK diff has failed. See above console output for more details."
		exit 1
	fi
}

diff
