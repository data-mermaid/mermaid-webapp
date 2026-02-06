#!/bin/bash

files=$(find src/App/integrationTests -name "*.test.jsx" -exec grep -l "http\.post\|http\.get\|http\.put\|http\.delete\|http\.patch" {} \;)

for filepath in $files; do
    echo "Cleaning params in: $filepath"
    
    # Remove unused parameters from handler functions
    # Pattern: http.VERB(`url`, (req, res, ctx) => { -> http.VERB(`url`, () => {
    sed -i.bak 's/\(http\.\(post\|get\|put\|delete\|patch\)([^,]*,\s*(\)req,\s*res,\s*ctx\(\s*)\)/\1\3/g' "$filepath"
    sed -i.bak 's/\(http\.\(post\|get\|put\|delete\|patch\)([^,]*,\s*(\)req\(\s*)\)/\1\3/g' "$filepath"
    sed -i.bak 's/\(http\.\(post\|get\|put\|delete\|patch\)([^,]*,\s*(\)_req,\s*res,\s*ctx\(\s*)\)/\1\3/g' "$filepath"
    sed -i.bak 's/\(http\.\(post\|get\|put\|delete\|patch\)([^,]*,\s*(\)_req\(\s*)\)/\1\3/g' "$filepath"
    
    rm "${filepath}.bak" 2>/dev/null
done

echo "Cleanup complete!"
