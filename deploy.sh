#!/bin/bash

set -e

echo "Building project..."
npm run build

echo "Syncing to S3..."
aws s3 sync ./dist s3://my-demo-frontend --delete

echo "Deploy complete!"
