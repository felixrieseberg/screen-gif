#!/usr/bin/env node

const path = require('path');
const { spawn } = require('child_process');

// Get the path to our compiled binary
const binaryPath = path.join(__dirname, 'GifViewer');

// Spawn the binary with all the arguments passed to this script
const child = spawn(binaryPath, process.argv.slice(2), {
  stdio: 'inherit'
});

// Forward the exit code
child.on('exit', (code) => {
  process.exit(code);
});
