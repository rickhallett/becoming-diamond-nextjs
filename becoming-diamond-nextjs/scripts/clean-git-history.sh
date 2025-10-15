#!/bin/bash

# Clean git history: remove "Generated with Claude Code" and set author to rickhallett
# WARNING: This rewrites git history. Only run on branches you haven't shared yet,
# or coordinate with your team before running.

set -e

echo "This will rewrite git history. Make sure you have a backup!"
echo "Press Ctrl+C to cancel, or Enter to continue..."
read

# Set your author information
export GIT_AUTHOR_NAME="rickhallett"
export GIT_AUTHOR_EMAIL="$(git config user.email)"
export GIT_COMMITTER_NAME="rickhallett"
export GIT_COMMITTER_EMAIL="$(git config user.email)"

# Filter branch to update commit messages and author
git filter-branch --env-filter '
    export GIT_AUTHOR_NAME="rickhallett"
    export GIT_AUTHOR_EMAIL="'"$GIT_AUTHOR_EMAIL"'"
    export GIT_COMMITTER_NAME="rickhallett"
    export GIT_COMMITTER_EMAIL="'"$GIT_AUTHOR_EMAIL"'"
' --msg-filter '
    sed -e "s/🤖 Generated with \[Claude Code\](https:\/\/claude\.com\/claude-code)//g" \
        -e "s/Co-Authored-By: Claude <noreply@anthropic\.com>//g" \
        -e "/^[[:space:]]*$/d"
' --tag-name-filter cat -- --all

echo ""
echo "History rewritten. Review with 'git log' before force pushing."
echo "To force push: git push --force-with-lease origin main"
