#!/usr/bin/env node

const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

// Get the path to our compiled binary
const binaryPath = path.join(__dirname, 'GifViewer');

// If the binary doesn't exist, do nothing
if (!fs.existsSync(binaryPath)) {
  if ((process.env.DEBUG || "").includes("screen-gif")) {
    console.log('GifViewer helper app not found. Make sure it was compiled during installation.');
    process.exit(1);
  }

  // Otherwise, exit silently
  process.exit(0);
}

// Spawn the binary with all the arguments passed to this script
const child = spawn(binaryPath, process.argv.slice(2), {
  stdio: 'inherit'
});

// Forward the exit code
child.on('exit', (code) => {
  process.exit(code);
});
