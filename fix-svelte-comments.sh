#!/bin/bash

# Function to process a single file
process_file() {
    local file="$1"
    
    # Create a temporary file
    temp_file=$(mktemp)
    
    # Process the file line by line
    while IFS= read -r line || [[ -n "$line" ]]; do
        # Replace // comments with HTML comments, preserving indentation
        if [[ "$line" =~ ^[[:space:]]*//[[:space:]]*(.*) ]]; then
            indent="${line%%//*}"
            comment="${BASH_REMATCH[1]}"
            echo "${indent}<!-- ${comment} -->" >> "$temp_file"
        # Skip lines that are part of multi-line comments
        elif [[ "$line" =~ ^[[:space:]]?\*.*$ ]]; then
            continue
        # Convert /* ... */ style comments to HTML comments
        elif [[ "$line" =~ ^([[:space:]]*)\/\*(.*)\*\/$ ]]; then
            indent="${BASH_REMATCH[1]}"
            comment="${BASH_REMATCH[2]}"
            echo "${indent}<!-- ${comment} -->" >> "$temp_file"
        else
            echo "$line" >> "$temp_file"
        fi
    done < "$file"
    
    # Replace original file with processed file
    mv "$temp_file" "$file"
}

# Find all .svelte files and process them
find src -name "*.svelte" -type f | while read -r file; do
    echo "Processing $file..."
    process_file "$file"
done

echo "All Svelte files have been processed!"
