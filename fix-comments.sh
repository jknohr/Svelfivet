#!/bin/bash

# Find all .svelte files and replace JavaScript comments with Svelte comments
find src -name "*.svelte" -type f -exec sed -i 's/{\/\* @ts-ignore.*\*\/}/<!-- @ts-ignore - Library type definitions need updating for Svelte 5 -->/g' {} +
