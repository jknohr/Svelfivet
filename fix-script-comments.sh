#!/bin/bash

# Function to process a single file
process_file() {
    local file="$1"
    local temp_file=$(mktemp)
    local in_script=false
    
    while IFS= read -r line || [[ -n "$line" ]]; do
        # Check if we're entering a script tag
        if [[ "$line" =~ \<script ]]; then
            in_script=true
            echo "$line" >> "$temp_file"
            continue
        fi
        
        # Check if we're exiting a script tag
        if [[ "$line" =~ \</script\> ]]; then
            in_script=false
            echo "$line" >> "$temp_file"
            continue
        fi
        
        # If we're in a script tag, convert HTML comments back to JS comments
        if [[ "$in_script" == true ]]; then
            # Convert HTML comments to JS comments inside script tags
            if [[ "$line" =~ ^([[:space:]]*)<!--[[:space:]]*(.*)[[:space:]]*--\>[[:space:]]*$ ]]; then
                indent="${BASH_REMATCH[1]}"
                comment="${BASH_REMATCH[2]}"
                # Special case for @ts-ignore
                if [[ "$comment" =~ ^@ts-ignore ]]; then
                    echo "${indent}// ${comment}" >> "$temp_file"
                else
                    echo "${indent}// ${comment}" >> "$temp_file"
                fi
            else
                echo "$line" >> "$temp_file"
            fi
        else
            echo "$line" >> "$temp_file"
        fi
    done < "$file"
    
    mv "$temp_file" "$file"
}

# Find all .svelte files and process them
find src -name "*.svelte" -type f | while read -r file; do
    echo "Processing $file..."
    process_file "$file"
done

echo "All Svelte files have been processed!"
