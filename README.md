# VideoSave Telegram Bot

A Telegram bot that downloads videos from YouTube, TikTok, and Instagram.

## Features

- ✅ Download videos from YouTube
- ✅ Download videos from TikTok (requires yt-dlp)
- ✅ Download videos from Instagram (requires yt-dlp)
- ✅ Simple interface - just send a link!
- ✅ Automatic file cleanup

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- For TikTok/Instagram: Python and yt-dlp (optional but recommended)

## Installation

1. **Clone or download this repository**

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Get a Telegram Bot Token:**
   - Open Telegram and search for [@BotFather](https://t.me/BotFather)
   - Send `/newbot` and follow the instructions
   - Copy your bot token

4. **Create a `.env` file:**
   ```bash
   cp .env.example .env
   ```
   
   Then edit `.env` and add your bot token:
   ```
   BOT_TOKEN=your_actual_bot_token_here
   ```

5. **Install yt-dlp (Optional but recommended for TikTok/Instagram):**
   ```bash
   pip install yt-dlp
   ```
   
   Or using pip3:
   ```bash
   pip3 install yt-dlp
   ```

## Running the Bot

**Start the bot:**
```bash
npm start
```

**For development (with auto-restart):**
```bash
npm run dev
```

## Usage

1. Start a chat with your bot on Telegram
2. Send `/start` to see the welcome message
3. Send any video URL from:
   - YouTube (youtube.com or youtu.be)
   - TikTok (tiktok.com or vm.tiktok.com)
   - Instagram (instagram.com)
4. Wait for the bot to download and send the video

## Commands

- `/start` - Show welcome message
- `/help` - Get help and usage instructions
- `/supported` - Show supported platforms

## How It Works

- **YouTube**: Uses `ytdl-core` library (works out of the box)
- **TikTok/Instagram**: Uses `yt-dlp` if installed, otherwise shows an error message

## File Size Limits

Telegram has a 50MB file size limit. Videos larger than this cannot be sent through Telegram.

## Troubleshooting

### Bot doesn't respond
- Check that your `.env` file has the correct `BOT_TOKEN`
- Make sure the bot is running (`npm start`)
- Verify the token is correct with BotFather

### TikTok/Instagram downloads fail
- Install yt-dlp: `pip install yt-dlp`
- Make sure yt-dlp is in your system PATH
- Try updating yt-dlp: `pip install --upgrade yt-dlp`

### YouTube downloads fail
- Check your internet connection
- Some YouTube videos may be restricted or unavailable
- Try a different video URL

### "File too large" error
- Telegram has a 50MB limit
- The video is too large to send
- Consider using a video compression tool or downloading directly

## Project Structure

```
telegram bot/
├── bot.js           # Main bot file
├── package.json     # Dependencies
├── .env             # Your bot token (create this)
├── .env.example     # Example env file
├── .gitignore       # Git ignore rules
├── README.md        # This file
└── downloads/       # Temporary download folder (auto-created)
```

## License

MIT

## Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Make sure all dependencies are installed
3. Verify your bot token is correct
4. Check that yt-dlp is installed for TikTok/Instagram support

