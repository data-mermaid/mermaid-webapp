#!/bin/bash

# Get list of files with ctx.status
files=$(find src/App/integrationTests -name "*.test.jsx" -exec grep -l "ctx\.status\|HttpResponse\.json({}, { status" {} \;)

for filepath in $files; do
    echo "Fixing status in: $filepath"
    
    # Replace ctx.status(NUMBER) with HttpResponse.json({}, { status: NUMBER })
    # This is more complex because we need to capture the number
    sed -i.bak 's/ctx\.status(\([0-9]*\))/HttpResponse.json({}, { status: \1 })/g' "$filepath"
    
    # Clean up backup
    rm "${filepath}.bak" 2>/dev/null
done

echo "Status fixes complete!"
