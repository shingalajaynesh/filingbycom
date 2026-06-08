#!/bin/bash

# Navigate to the directory (optional, if running from elsewhere)
# cd /path/to/your/project

echo "Fetching latest changes from remote..."
git fetch origin

echo "Pulling changes into current branch..."
git pull origin $(git branch --show-current)

if [ $? -eq 0 ]; then
    echo "Successfully updated!"
else
    echo "Error: Pull failed. Check for merge conflicts."
    exit 1
fi