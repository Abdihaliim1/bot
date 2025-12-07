# Install yt-dlp for Better Video Downloads

## Why yt-dlp?

yt-dlp is more reliable than ytdl-core and works better with:
- YouTube (handles all video types)
- TikTok
- Instagram
- Many other platforms

## Installation

### macOS (using Homebrew - Recommended)
```bash
brew install yt-dlp
```

### macOS/Linux (using pip)
```bash
pip install yt-dlp
```

Or if you have pip3:
```bash
pip3 install yt-dlp
```

### Verify Installation
After installing, verify it works:
```bash
yt-dlp --version
```

You should see a version number like: `2024.01.07`

## After Installation

1. Restart your bot:
   ```bash
   npm start
   ```

2. Test with a YouTube link - it should work much better now!

## Troubleshooting

### "Command not found" after installation
- Make sure yt-dlp is in your PATH
- Try: `pip install --user yt-dlp` and add to PATH
- Or use full path: `/usr/local/bin/yt-dlp` or `~/.local/bin/yt-dlp`

### Still having issues?
The bot will try yt-dlp first, then fallback to ytdl-core if yt-dlp isn't available.

