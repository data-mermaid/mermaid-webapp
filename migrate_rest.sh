#!/bin/bash

# Get list of files to migrate
files=$(find src/App/integrationTests -name "*.test.jsx" -exec grep -l "^import.*rest.*from.*msw" {} \;)

for filepath in $files; do
    echo "Migrating: $filepath"
    
    # Replace import statement
    sed -i.bak "s/^import { rest } from 'msw'$/import { http, HttpResponse } from 'msw'/" "$filepath"
    sed -i.bak "s/^import { rest } from \"msw\"$/import { http, HttpResponse } from 'msw'/" "$filepath"
    
    # Replace rest. methods
    sed -i.bak 's/rest\.post(/http.post(/g' "$filepath"
    sed -i.bak 's/rest\.get(/http.get(/g' "$filepath"
    sed -i.bak 's/rest\.put(/http.put(/g' "$filepath"
    sed -i.bak 's/rest\.delete(/http.delete(/g' "$filepath"
    sed -i.bak 's/rest\.patch(/http.patch(/g' "$filepath"
    
    # Replace ctx.json
    sed -i.bak 's/ctx\.json(/HttpResponse.json(/g' "$filepath"
    
    # Replace res( with just return (but be careful with res.once)
    # First handle res.once -> we'll need to add { once: true } as 3rd param
    # For now, just do the simple res( wrapping
    sed -i.bak 's/return res(/return /g' "$filepath"
    
    # Replace res.networkError
    sed -i.bak 's/res\.networkError([^)]*)/HttpResponse.error()/g' "$filepath"
    
    # Clean up backup files
    rm "${filepath}.bak"
done

echo "Migration complete!"
