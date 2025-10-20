#!/usr/bin/env node

import { readFileSync } from "fs";

const msgFile = process.argv[2];
if (!msgFile) {
  process.exit(1);
}
const commitMsg = readFileSync(msgFile, "utf8");

if (/^(feat|fix|docs|test|refactor)/.test(commitMsg)) {
  console.log("✅ Commit message is valid");
  process.exit(0);
} else {
  process.exit(1);
}
