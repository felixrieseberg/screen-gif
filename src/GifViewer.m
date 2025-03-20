#import <Cocoa/Cocoa.h>

@interface AppDelegate : NSObject <NSApplicationDelegate>
@property (nonatomic, strong) NSWindow *window;
@property (nonatomic, strong) NSImageView *imageView;
@end

@implementation AppDelegate

- (void)applicationDidFinishLaunching:(NSNotification *)notification {
    // Parse command line arguments
    NSArray *args = [[NSProcessInfo processInfo] arguments];

    // Log all arguments for debugging
    NSLog(@"GifViewer launched with arguments: %@", args);

    // Default values
    NSString *url = nil;
    CGFloat x = 0, y = 0, width = 400, height = 400;
    BOOL center = NO;

    // Parse arguments
    for (int i = 1; i < args.count; i++) {
        NSString *arg = args[i];

        if ([arg isEqualToString:@"--url"] && i + 1 < args.count) {
            url = args[++i];
        } else if ([arg isEqualToString:@"--x"] && i + 1 < args.count) {
            x = [args[++i] floatValue];
        } else if ([arg isEqualToString:@"--y"] && i + 1 < args.count) {
            y = [args[++i] floatValue];
        } else if ([arg isEqualToString:@"--width"] && i + 1 < args.count) {
            width = [args[++i] floatValue];
        } else if ([arg isEqualToString:@"--height"] && i + 1 < args.count) {
            height = [args[++i] floatValue];
        } else if ([arg isEqualToString:@"--center"]) {
            center = YES;
        }
    }

    // Validate URL
    if (!url) {
        NSLog(@"Error: No URL provided");
        [NSApp terminate:nil];
        return;
    }

    NSLog(@"Creating window at position (%f, %f) with size (%f, %f)", x, y, width, height);

    // Get screen dimensions
    NSRect screenRect = [[NSScreen mainScreen] frame];

    // Calculate center position if requested
    if (center) {
        x = (screenRect.size.width - width) / 2;
        y = (screenRect.size.height - height) / 2;
    } else {
        // Ensure window is on screen
        if (x < 0 || x > screenRect.size.width - 100) x = 100;
        if (y < 0 || y > screenRect.size.height - 100) y = 100;
    }

    // Convert y-coordinate from bottom-left to top-left origin
    y = screenRect.size.height - y - height;

    // Create frameless window (no title bar, no buttons)
    self.window = [[NSWindow alloc]
        initWithContentRect:NSMakeRect(x, y, width, height)
        styleMask:NSWindowStyleMaskBorderless  // Frameless window
        backing:NSBackingStoreBuffered
        defer:NO];

    // Make window transparent with no background
    self.window.backgroundColor = [NSColor clearColor];
    self.window.opaque = NO;

    // Make window float above other windows
    self.window.level = NSFloatingWindowLevel;

    // Allow the window to appear on all spaces
    self.window.collectionBehavior = NSWindowCollectionBehaviorCanJoinAllSpaces;

    NSLog(@"Window created");

    // Create image view
    self.imageView = [[NSImageView alloc] initWithFrame:NSMakeRect(0, 0, width, height)];
    self.imageView.imageScaling = NSImageScaleProportionallyUpOrDown;
    self.imageView.animates = YES;

    // Make image view background transparent
    self.imageView.wantsLayer = YES;
    self.imageView.layer.backgroundColor = [NSColor clearColor].CGColor;

    [self.window.contentView addSubview:self.imageView];

    NSLog(@"Image view created and added to window");

    // Load image
    NSURL *imageURL;
    if ([url hasPrefix:@"http://"] || [url hasPrefix:@"https://"]) {
        imageURL = [NSURL URLWithString:url];
        NSLog(@"Loading image from URL: %@", url);
    } else {
        imageURL = [NSURL fileURLWithPath:url];
        NSLog(@"Loading image from file: %@", url);
    }

    NSImage *image = [[NSImage alloc] initWithContentsOfURL:imageURL];
    if (image) {
        self.imageView.image = image;
        NSLog(@"Image loaded successfully from: %@", url);

        // Show window only if image loaded successfully
        [self.window makeKeyAndOrderFront:nil];
        [NSApp activateIgnoringOtherApps:YES];

        NSLog(@"Window should now be visible");
    } else {
        // If image fails to load, log error and exit
        NSLog(@"Failed to load image from: %@", url);
        [NSApp terminate:nil];
    }
}

- (BOOL)applicationShouldTerminateAfterLastWindowClosed:(NSApplication *)sender {
    return YES;
}

@end

int main(int argc, const char * argv[]) {
    @autoreleasepool {
        // Create the application
        NSApplication *app = [NSApplication sharedApplication];

        // Create and set the app delegate
        AppDelegate *delegate = [[AppDelegate alloc] init];
        [app setDelegate:delegate];

        // Set activation policy to accessory (no dock icon)
        [app setActivationPolicy:NSApplicationActivationPolicyAccessory];

        // Run the application
        NSLog(@"Starting GifViewer application");
        [app run];
    }
    return 0;
}
