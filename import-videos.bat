@echo off
echo Running video import script...

REM Set environment variables
set NODE_ENV=development
set NODE_OPTIONS=--experimental-specifier-resolution=node --loader ts-node/esm

REM Run the script using ts-node directly
npx ts-node --esm --experimentalSpecifier=node --project tsconfig.json src/scripts/import-videos.ts

echo Script execution completed.
pause 