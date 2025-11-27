#!/bin/bash
set -e

echo "Building ChoreChamp client..."
cd client
echo "Installing dependencies..."
npm ci
echo "Running build..."
npm run build
echo "Build complete!"
