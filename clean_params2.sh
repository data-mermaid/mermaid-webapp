#!/bin/bash

files=$(find src/App/integrationTests -name "*.test.jsx")

for filepath in $files; do
    # Just remove (req, res, ctx) parameters and replace with ()
    # Match http.VERB(`url`, (req, res, ctx) => and replace with http.VERB(`url`, () =>
    sed -i.bak 's/(req, res, ctx) =>/()/g' "$filepath"
    sed -i.bak 's/(_req, res, ctx) =>/()/g' "$filepath"
    sed -i.bak 's/(req) =>/()/g' "$filepath"
    sed -i.bak 's/(_req) =>/()/g' "$filepath"
    
    rm "${filepath}.bak" 2>/dev/null
done

echo "Parameter cleanup complete!"
