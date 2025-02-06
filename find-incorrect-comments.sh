#!/bin/bash

# Function to check a file for incorrect comments
check_file() {
    local file="$1"
    local in_script=false
    local has_incorrect=false
    
    while IFS= read -r line; do
        if [[ "$line" =~ \<script ]]; then
            in_script=true
            continue
        fi
        
        if [[ "$line" =~ \</script\> ]]; then
            in_script=false
            continue
        fi
        
        if [[ "$in_script" == true ]] && [[ "$line" =~ \<!--.*--\> ]]; then
            echo "Found incorrect HTML comment in script tag in: $file"
            echo "Line: $line"
            has_incorrect=true
        fi
    done < "$file"
    
    return $([ "$has_incorrect" == true ] && echo 0 || echo 1)
}

# Find all .svelte files and check them
find src -name "*.svelte" -type f | while read -r file; do
    check_file "$file"
done
