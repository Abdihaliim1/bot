# 🚀 Quick Start - Get Your Bot Working NOW

## ✅ Your Bot is Ready!

Your bot token is configured: `8233138444:AAE-LqA9V1aS-vRQ5K03FwBdejoWQ1qNPsM`
Bot username: **@Instasavekebot**

## Step 1: Start the Bot

Open a terminal in this directory and run:

```bash
npm start
```

**OR** use the helper script:

```bash
./start-bot.sh
```

You should see:
```
✅ Bot connected successfully!
🤖 Bot username: @Instasavekebot
📱 Bot is ready to receive messages...
```

**⚠️ IMPORTANT:** Keep this terminal window open! The bot needs to keep running.

## Step 2: Test in Telegram

1. Open Telegram (mobile or desktop)
2. Search for: **@Instasavekebot**
3. Click **"Start"** or send `/start`
4. **Check your terminal** - you should see:
   ```
   📨 Received /start from chat 123456789
   ✅ Sent welcome message to chat 123456789
   ```

## Step 3: Test Video Download

Send a YouTube link to your bot:
```
https://www.youtube.com/watch?v=dQw4w9WgXcQ
```

Watch the terminal for progress messages.

## What to Look For

### ✅ Working Correctly:
- Terminal shows: `✅ Bot connected successfully!`
- When you send `/start`, terminal shows: `📨 Received /start...`
- Bot responds in Telegram

### ❌ Not Working:
- No "Bot connected" message → Check `.env` file
- "Polling error" → Check internet connection
- Bot doesn't respond → Check terminal for errors

## Need Help?

See `TROUBLESHOOTING.md` for detailed help.

## Running in Background (Optional)

If you want to run the bot in the background:

```bash
nohup npm start > bot.log 2>&1 &
```

Then check logs with:
```bash
tail -f bot.log
```

