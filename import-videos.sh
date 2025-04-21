#!/bin/bash
echo "Running video import script..."

# Set environment variables if needed
export NODE_ENV=development

# Run the script with ts-node
npx ts-node -r tsconfig-paths/register src/scripts/import-videos.ts

echo "Script execution completed." 