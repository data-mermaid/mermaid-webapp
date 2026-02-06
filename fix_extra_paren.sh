#!/bin/bash

files=$(find src/App/integrationTests -name "*.test.jsx")

for filepath in $files; do
    # Remove extra closing parentheses after HttpResponse.json(...)) 
    sed -i.bak 's/HttpResponse\.json(\([^)]*\)))/HttpResponse.json(\1)/g' "$filepath"
    
    rm "${filepath}.bak" 2>/dev/null
done

echo "Extra parenthesis fix complete!"
