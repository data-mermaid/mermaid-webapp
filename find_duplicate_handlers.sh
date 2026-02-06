#!/bin/bash

# Find files with multiple handlers to the same endpoint
files=$(find src/App/integrationTests -name "*.test.jsx")

for filepath in $files; do
    # Count http.post calls to /pull/ 
    count=$(grep -c 'http\.post.*pull/' "$filepath")
    if [ "$count" -gt 1 ]; then
        echo "$filepath: $count handlers to /pull/"
    fi
done
