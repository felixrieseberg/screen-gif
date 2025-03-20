const gifViewer = require('../js');

gifViewer.showGif({
  url: "https://media1.tenor.com/m/2L8cGGO6_MIAAAAC/operation-teapot-nuke.gif",
  center: true,
  size: { width: 400, height: 400 },
  duration: 5000
});

// Keep the process running
setInterval(() => {
  console.log("Still running... (Press Ctrl+C to exit)");
}, 5000);
