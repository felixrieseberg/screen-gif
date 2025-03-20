const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('Compiling GifViewer helper application...');

const isDebug = (process.env.DEBUG || "").includes("screen-gif");
const log = isDebug ? console.log : () => {};
const err = isDebug ? console.error : () => {};

try {
  // Get the root directory of the package
  const rootDir = path.resolve(__dirname, '..');

  // Source and output paths
  const sourcePath = path.join(rootDir, 'src', 'GifViewer.m');
  const outputDir = path.join(rootDir, 'bin');
  const outputPath = path.join(outputDir, 'GifViewer');

  // Return if it already exists
  if (fs.existsSync(outputPath)) {
    log('GifViewer already compiled, skipping...');
    return;
  }

  // Create bin directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Compile the GifViewer application
  const compileCommand = `clang -framework Cocoa -o "${outputPath}" "${sourcePath}"`;
  log(`Executing: ${compileCommand}`);

  execSync(compileCommand, { stdio: 'inherit' });

  // Make the binary executable
  fs.chmodSync(outputPath, '755');

  log(`GifViewer compiled successfully to: ${outputPath}`);
} catch (error) {
  err('Error compiling GifViewer:', error.message);

  if (isDebug) {
    process.exit(1);
  }
}
