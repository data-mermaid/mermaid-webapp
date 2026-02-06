#!/bin/bash

# This is a complex migration - we need to find patterns where we have multiple handlers 
# that respond to the same endpoint and add { once: true } to all but the last one

files=$(find src/App/integrationTests -name "*.test.jsx")

for filepath in $files; do
    # Look for files that have multiple http.post/get/etc with the same URL
    # For now, we'll use a simpler heuristic: if a handler has multiple responses to /pull/
    # we add { once: true } to all but the last /pull/ handler
    
    # This is complex to do with sed, so let's use a Python approach
    true
done

echo "Need custom solution for adding { once: true } parameters"
