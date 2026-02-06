#!/bin/bash

# For files with multiple /pull/ handlers, we need to add { once: true } to all but the last
# The pattern is: http.post(`...pull/`, () => { ... }, { once: true })

files=$(find src/App/integrationTests -name "*.test.jsx" -exec grep -l "http\.post.*pull/" {} \;)

for filepath in $files; do
    count=$(grep -c 'http\.post.*pull/' "$filepath")
    
    if [ "$count" -gt 1 ]; then
        echo "Fixing $filepath with $count handlers"
        
        # Create a temp file
        temp_file="${filepath}.tmp"
        handler_count=0
        in_handler=0
        closing_brace_line=""
        
        while IFS= read -r line; do
            # Check if this is an http.post line for /pull/
            if echo "$line" | grep -q 'http\.post.*pull/'; then
                ((handler_count++))
                in_handler=1
                echo "$line" >> "$temp_file"
            elif [ "$in_handler" = "1 " ] && echo "$line" | grep -q '^\s*}),\?$'; then
                # This is the closing brace of the handler
                # If this is not the last handler (handler_count < count), add { once: true }
                if [ "$handler_count" -lt "$count" ]; then
                    # Replace }), with }, { once: true }),
                    echo "$line" | sed 's/^\(\s*\)}),$/ \1}, { once: true }),/' >> "$temp_file"
                else
                    echo "$line" >> "$temp_file"
                fi
                in_handler=0
            else
                echo "$line" >> "$temp_file"
            fi
        done < "$filepath"
        
        # Move temp file back
        mv "$temp_file" "$filepath"
    fi
done

echo "Handlers fixed!"
