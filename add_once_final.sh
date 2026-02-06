#!/bin/bash

files=$(find src/App/integrationTests -name "*.test.jsx" | while read f; do grep -q 'http\.post.*pull/' "$f" && echo "$f"; done)

for filepath in $files; do
    echo "Adding { once: true } to: $filepath"
    
    # Count how many http.post to /pull/ in this file
    count=$(grep -c 'http\.post.*pull/' "$filepath")
    
    if [ "$count" -gt 1 ]; then
        # We need to add { once: true } to all but the last handler
        # This is tricky with sed, so we'll use a multi-step approach
        
        # First, mark the last occurrence
        sed -i.bak "0,/http\.post(\`\${apiBaseUrl}\/pull\/\`/! {
            0,/http\.post(\`\${apiBaseUrl}\/pull\/\`/{
                s/^\(\s*http\.post(\`\${apiBaseUrl}\/pull\/\`,\s*() => {.*\n.*\n.*return HttpResponse\.json(.*)\s*}\),$/&__LAST__/
            }
        }" "$filepath" 2>/dev/null || true
        
        rm "${filepath}.bak" 2>/dev/null
    fi
done

echo "Marking complete - manual step needed"
