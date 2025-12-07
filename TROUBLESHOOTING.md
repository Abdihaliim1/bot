# Troubleshooting Guide

## Bot Not Responding?

### Step 1: Check if Bot is Running

```bash
ps aux | grep "node bot.js"
```

If you see a process, the bot is running. If not, start it:
```bash
npm start
```

### Step 2: Check Bot Connection

Run the test script:
```bash
node test-connection.js
```

You should see:
```
✅ Bot connection successful!
🤖 Bot username: @Instasavekebot
```

### Step 3: Check Bot Logs

Start the bot in the foreground to see logs:
```bash
./start-bot.sh
```

Or:
```bash
node bot.js
```

You should see:
```
✅ Bot connected successfully!
🤖 Bot username: @Instasavekebot
📱 Bot is ready to receive messages...
```

### Step 4: Test in Telegram

1. Open Telegram
2. Search for: **@Instasavekebot**
3. Click "Start" or send `/start`
4. **Watch the terminal** - you should see:
   ```
   📨 Received /start from chat 123456789
   ✅ Sent welcome message to chat 123456789
   ```

### Common Issues

#### Issue: Bot doesn't respond to /start
**Solution:**
- Make sure the bot is running (`npm start`)
- Check the terminal for error messages
- Verify your `.env` file has the correct token

#### Issue: "Polling error" in terminal
**Solution:**
- Check your internet connection
- Verify the bot token is correct
- Try restarting the bot

#### Issue: Bot responds but doesn't download videos
**Solution:**
- For YouTube: Should work immediately
- For TikTok/Instagram: Install yt-dlp:
  ```bash
  pip install yt-dlp
  ```

#### Issue: "BOT_TOKEN not found"
**Solution:**
- Make sure `.env` file exists in the same directory as `bot.js`
- Check that `.env` contains: `BOT_TOKEN=your_token_here`
- No quotes around the token
- No spaces around the `=` sign

### Debug Mode

To see all messages the bot receives, start it with:
```bash
node bot.js
```

You'll see logs like:
- `📨 Received message from chat...`
- `🔗 Detected URL: ...`
- `✅ Sent welcome message...`

### Still Not Working?

1. **Kill all bot processes:**
   ```bash
   pkill -f "node bot.js"
   ```

2. **Restart the bot:**
   ```bash
   npm start
   ```

3. **Check for errors in terminal**

4. **Verify bot token:**
   ```bash
   node test-connection.js
   ```

