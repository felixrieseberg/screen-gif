const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

class GifViewer {
  constructor() {
    this.helperAppPath = this.findHelperApp();

    this.isDebug = (process.env.DEBUG || "").includes("screen-gif");
    this.log = this.isDebug ? console.log : () => {};
    this.warn = this.isDebug ? console.warn : () => {};
    this.error = this.isDebug ? console.error : () => {};
  }

  findHelperApp() {
    // Look for the helper app in various locations
    const possiblePaths = [
      path.join(__dirname, '..', 'bin', 'GifViewer'),
      path.join(__dirname, '..', '..', 'bin', 'GifViewer'),
      path.resolve('./bin/GifViewer')
    ];

    for (const appPath of possiblePaths) {
      if (fs.existsSync(appPath)) {
        return appPath;
      }
    }
  }

  showGif(options) {
    if (!this.helperAppPath) {
      if (this.isDebug) {
        this.warn('GifViewer helper app not found. Make sure it was compiled during installation.');
      }

      return
    }

    if (!options?.url) {
      throw new Error('URL is required');
    }

    // Default values
    const size = options.size || { width: 200, height: 200 };

    // Prepare arguments for the helper app
    const args = [
      '--url', options.url,
      '--width', size.width.toString(),
      '--height', size.height.toString()
    ];

    // Add position arguments based on centering option
    if (options.center || !options.position) {
      args.push('--center');
    } else {
      args.push('--x', (options.position.x || 0).toString());
      args.push('--y', (options.position.y || 0).toString());
    }

    const child = spawn(this.helperAppPath, args, { stdio: 'ignore' });

    child.on('stdout', (data) => {
      this.log(data.toString());
    });

    child.on('stderr', (data) => {
      this.error(data.toString());
    });

    // Handle duration if specified
    if (options.duration) {
      setTimeout(() => {
        child.kill();
      }, options.duration);
    }

    process.on('exit', () => {
      child.kill();
    });

    return child;
  }
}

if (process.platform === 'darwin') {
  module.exports = new GifViewer();
} else {
  module.exports = {
    // No-op on non-macOS platforms
    showGif: () => {}
  };
}

