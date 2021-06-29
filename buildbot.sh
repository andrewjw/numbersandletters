#!/bin/bash

set -e

npm ci

node node_modules/gulp/bin/gulp.js build

BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [[ "$BRANCH" == "master" ]]; then
  rsync -avc --delete built/ $SSH_USER@$SSH_HOST:numbersandletters/
fi
