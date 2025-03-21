# screen-gif

A lightweight zero-dependencies utility for displaying GIFs anywhere on your macOS screen. This is primarily meant for internal fun. This module will compile a little mini-binary during post-installation (you can see the source code in src/GifViewer.m) and then call it from this module.

## Features

- Display GIFs anywhere on your screen
- Control size and position
- Center GIFs on screen automatically
- Runs without a dock icon
- Simple JavaScript API

## Installation

```sh
npm install screen-gif
```

## Usage

You can use screen-gif either through its JavaScript API or directly via CLI.

### CLI Usage

Run directly with npx:
```sh
npx screen-gif --url path/to/your.gif [options]
```

Or after installation:
```sh
screen-gif --url path/to/your.gif [options]
```

#### CLI Options
- `--url` (required): URL or file path of the GIF to display
- `--x`: Horizontal position from left edge (default: 0)
- `--y`: Vertical position from top edge (default: 0)
- `--width`: Width in pixels (default: 400)
- `--height`: Height in pixels (default: 400)
- `--center`: Center the GIF on screen (overrides x/y positions)
- `--timeout`: Close the GIF after specified seconds

Examples:
```sh
# Display a local GIF centered on screen
npx screen-gif --url ./my-gif.gif --center

# Display a web GIF at specific position and size
npx screen-gif --url https://example.com/gif.gif --x 100 --y 100 --width 300 --height 300

# Display a GIF that closes after 5 seconds
npx screen-gif --url ./my-gif.gif --center --timeout 5
```

## JavaScript API

Everything will silently fail by default, given that this is mostly for fun. If you want to see error output,
set the environment variable `DEBUG` to `screen-gif`.

### `showGif(options)`

Displays a GIF on screen with the specified options.

#### Options

- `url` (required): URL or file path of the GIF to display
- `position`: (optional) Object containing x and y coordinates
  - `x`: Horizontal position from left edge (default: 0)
  - `y`: Vertical position from top edge (default: 0)
- `size`: (optional) Object containing width and height
  - `width`: Width in pixels (default: 200)
  - `height`: Height in pixels (default: 200)
- `center`: Boolean to center the GIF on screen (default: true). Override with `position`.

## Requirements

This module is currently macOS-only and will silently do nothing on other platforms. Feel free to submit a PR to add support for other platforms!

- macOS 10.12 or later
- Node.js 12.0 or later

## License

MIT

