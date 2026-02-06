#!/bin/bash

files=$(find src/App/integrationTests -name "*.test.jsx")

for filepath in $files; do
    # Fix the arrow function syntax that was broken
    sed -i.bak 's/() {/() => {/g' "$filepath"
    
    rm "${filepath}.bak" 2>/dev/null
done

echo "Arrow fix complete!"
