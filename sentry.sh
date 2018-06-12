#!/usr/bin/env bash

curl https://sentry.io/api/hooks/release/builtin/1223778/6fb3afb73e3ffe85f787ed5d8f69df4ea7b662fd4eddbd2a26edfdea7ad50925/ \
  -X POST \
  -H 'Content-Type: application/json' \
  -d '{"version": "'"$COMMIT_REF"'"}'
