#!/bin/bash

set -e

echo "Building project..."
npm run build

echo "Syncing to S3..."
aws s3 sync ./build s3://firstcatch-publicdb.cjtrbcwexy25.us-east-1.rds.amazonaws.com --delete

echo "Deploy complete!"
