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
        
        # If we're in a script tag, keep JavaScript comments
        if [[ "$in_script" == true ]]; then
            echo "$line" >> "$temp_file"
            continue
        fi
        
        # Outside script tag, convert HTML-style comments
        # Skip if it's already an HTML comment
        if [[ "$line" =~ ^[[:space:]]*\<!--.*--\> ]]; then
            echo "$line" >> "$temp_file"
            continue
        fi
        
        # Convert single-line JS comments to HTML comments
        if [[ "$line" =~ ^([[:space:]]*)//[[:space:]]*(.*) ]]; then
            indent="${BASH_REMATCH[1]}"
            comment="${BASH_REMATCH[2]}"
            echo "${indent}<!-- ${comment} -->" >> "$temp_file"
            continue
        fi
        
        # Convert multi-line JS comments to HTML comments
        if [[ "$line" =~ ^([[:space:]]*)\/\*(.*)\*\/ ]]; then
            indent="${BASH_REMATCH[1]}"
            comment="${BASH_REMATCH[2]}"
            echo "${indent}<!-- ${comment} -->" >> "$temp_file"
            continue
        fi
        
        echo "$line" >> "$temp_file"
    done < "$file"
    
    mv "$temp_file" "$file"
}

# Find all .svelte files and process them
find src -name "*.svelte" -type f | while read -r file; do
    echo "Processing $file..."
    process_file "$file"
done

echo "All Svelte files have been processed!"
