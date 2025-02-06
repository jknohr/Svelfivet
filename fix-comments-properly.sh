#!/bin/bash

# Function to process a single file
process_file() {
    local file="$1"
    local temp_file=$(mktemp)
    local in_script=false
    local in_comment=false
    local comment_content=""
    local indent=""
    
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
            if [[ "$line" =~ ^([[:space:]]*)\/\*.*\*\/$ ]]; then
                # Single-line /* */ comment
                indent="${BASH_REMATCH[1]}"
                comment="${line#*\/\*}"
                comment="${comment%\*\/}"
                echo "${indent}// ${comment}" >> "$temp_file"
            elif [[ "$line" =~ ^([[:space:]]*)\/\* ]]; then
                # Start of multi-line comment
                in_comment=true
                indent="${BASH_REMATCH[1]}"
                comment_content="${line#*\/\*}"
            elif [[ "$line" =~ \*\/$ ]] && [[ "$in_comment" == true ]]; then
                # End of multi-line comment
                in_comment=false
                comment_content+=" ${line%\*\/}"
                echo "${indent}// ${comment_content}" >> "$temp_file"
                comment_content=""
            elif [[ "$in_comment" == true ]]; then
                # Middle of multi-line comment
                comment_content+=" ${line#*\*}"
            elif [[ "$line" =~ ^([[:space:]]*)(\/\/|<!--)[[:space:]]*(.*)[[:space:]]*(-->)?$ ]]; then
                # Single-line // or <!-- --> comment
                indent="${BASH_REMATCH[1]}"
                comment="${BASH_REMATCH[3]}"
                echo "${indent}// ${comment}" >> "$temp_file"
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
