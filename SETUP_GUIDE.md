# Quick Setup Guide - Activate Your Bot

## Step 1: Get Your Bot Token

1. Open Telegram and search for **@BotFather**
2. Start a chat with BotFather
3. Send the command: `/newbot`
4. Follow the instructions:
   - Choose a name for your bot (e.g., "My Video Downloader")
   - Choose a username (must end with "bot", e.g., "myvideodownloader_bot")
5. BotFather will give you a token that looks like: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`
6. **Copy this token** - you'll need it in the next step

## Step 2: Create .env File

Create a file named `.env` in this directory with your bot token:

```bash
BOT_TOKEN=your_actual_token_here
```

Replace `your_actual_token_here` with the token you got from BotFather.

**Quick way to create it:**
```bash
echo "BOT_TOKEN=your_actual_token_here" > .env
```

(Replace `your_actual_token_here` with your actual token)

## Step 3: Start the Bot

Run:
```bash
npm start
```

You should see:
```
🤖 VideoSave Bot is running!
📱 Bot is ready to receive messages...
```

## Step 4: Test the Bot

1. Open Telegram and search for your bot (using the username you created)
2. Click "Start" or send `/start`
3. You should receive a welcome message
4. Try sending a YouTube link, for example:
   ```
   https://www.youtube.com/watch?v=dQw4w9WgXcQ
   ```

## Troubleshooting

### Bot doesn't respond
- Make sure the bot is running (check terminal for errors)
- Verify your `.env` file has the correct token
- Make sure there are no extra spaces in your `.env` file

### "BOT_TOKEN not found" error
- Check that `.env` file exists in the same directory as `bot.js`
- Make sure the file contains: `BOT_TOKEN=your_token_here`
- No quotes needed around the token

### Bot starts but doesn't download videos
- For YouTube: Should work immediately
- For TikTok/Instagram: Install yt-dlp: `pip install yt-dlp`

## Optional: Install yt-dlp for TikTok/Instagram

```bash
pip install yt-dlp
```

Or if you have pip3:
```bash
pip3 install yt-dlp
```

