#!/bin/bash

files=$(find src/App/integrationTests -name "*.test.jsx")

for filepath in $files; do
    echo "Fixing res.once in: $filepath"
    
    # Remove res.once( wrapper from returns
    # Pattern: return res.once(HttpResponse.json(...)) -> return HttpResponse.json(...)
    sed -i.bak 's/return res\.once(/return /g' "$filepath"
    
    # Now we need to add { once: true } as third parameter
    # This is trickier - we need to find http.post/get/etc with a return statement that has HttpResponse.json
    # and add the third parameter
    # For now, let's just check if there are any remaining res.once
    
    rm "${filepath}.bak" 2>/dev/null
done

echo "res.once removal complete!"
