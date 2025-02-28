#!/bin/bash
# Start the .NET API in the background
dotnet /app/api/Ekygai.API.dll &

# Start the Next.js server (ensure package.json has a start script)
cd /app/frontend && npm start

wait
