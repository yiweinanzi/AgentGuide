#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WORKFLOW_FILE="$ROOT_DIR/.github/workflows/deploy-pages.yml"
INDEX_FILE="$ROOT_DIR/index.html"
GITIGNORE_FILE="$ROOT_DIR/.gitignore"
EXTERNAL_DIR="$ROOT_DIR/external/InterviewGuide"

grep -q "external/InterviewGuide/package-lock.json" "$WORKFLOW_FILE"
grep -q "working-directory: external/InterviewGuide" "$WORKFLOW_FILE"
grep -q "BASE_PATH: /AgentGuide/interview" "$WORKFLOW_FILE"
grep -q "cp -r external/InterviewGuide/dist/\\* interview/" "$WORKFLOW_FILE"

grep -q "external/InterviewGuide/dist/" "$GITIGNORE_FILE"
grep -q "external/InterviewGuide/node_modules/" "$GITIGNORE_FILE"
grep -q "external/InterviewGuide/.astro/" "$GITIGNORE_FILE"

grep -q "/AgentGuide/interview/" "$INDEX_FILE"
grep -q "<li><a href=\"/AgentGuide/interview/\">面经题库</a></li>" "$INDEX_FILE"

test -f "$EXTERNAL_DIR/package.json"
