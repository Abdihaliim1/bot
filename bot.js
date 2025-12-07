require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
// const ytdl = require('ytdl-core'); // Removed as it is deprecated/broken
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');

const execPromise = util.promisify(exec);

// Initialize bot
const token = process.env.BOT_TOKEN;
if (!token) {
  console.error('❌ Error: BOT_TOKEN not found in environment variables!');
  console.error('Please create a .env file with your bot token.');
  process.exit(1);
}

// Initialize bot with polling
const bot = new TelegramBot(token, {
  polling: {
    interval: 1000,
    autoStart: true,
    params: {
      timeout: 10
    }
  }
}
});

// Set bot commands (Menu)
bot.setMyCommands([
  { command: '/start', description: 'Start the bot and see welcome message' },
  { command: '/help', description: 'Get help on how to use the bot' },
  { command: '/supported', description: 'See supported sites (YouTube, Tikok, etc)' }
]).then(() => {
  console.log('✅ Bot commands menu set successfully');
}).catch((error) => {
  console.error('❌ Failed to set bot commands:', error.message);
});

// Create downloads directory if it doesn't exist
const downloadsDir = path.join(__dirname, 'downloads');
if (!fs.existsSync(downloadsDir)) {
  fs.mkdirSync(downloadsDir, { recursive: true });
}

// Supported platforms
const platforms = {
  youtube: ['youtube.com', 'youtu.be'],
  tiktok: ['tiktok.com', 'vm.tiktok.com'],
  instagram: ['instagram.com', 'instagr.am']
};

// Helper function to detect platform
function detectPlatform(url) {
  for (const [platform, domains] of Object.entries(platforms)) {
    if (domains.some(domain => url.includes(domain))) {
      return platform;
    }
  }
  return null;
}

// Helper function to clean up files
function cleanupFile(filePath) {
  setTimeout(() => {
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
      });
    }
  }, 60000); // Delete after 1 minute
}

// Channel to force subscribe
const REQUIRED_CHANNEL = '@fnyke';

// Check if user is subscribed
async function checkSubscription(userId) {
  try {
    const chatMember = await bot.getChatMember(REQUIRED_CHANNEL, userId);
    return ['creator', 'administrator', 'member'].includes(chatMember.status);
  } catch (error) {
    console.error('Error checking subscription:', error.message);
    // Return false on error (e.g. bot not admin) to enforce checking
    return false;
  }
}

// Download YouTube video - using yt-dlp with timeout
async function downloadYouTube(url, chatId) {
  const videoId = Date.now();
  const outputPath = path.join(downloadsDir, `youtube_${videoId}.%(ext)s`);

  // Determine yt-dlp command
  let ytdlpCommand = 'python3 -m yt_dlp'; // Use python3 module by default
  try {
    await execPromise('which yt-dlp', { timeout: 2000 });
    ytdlpCommand = 'yt-dlp';
  } catch {
    // Use python3 module
  }

  console.log(`📥 Downloading YouTube video: ${url}`);

  try {
    // Download with timeout (5 minutes max)
    const downloadCmd = `${ytdlpCommand} -f "best[height<=720][ext=mp4]/best[ext=mp4]/best" --no-playlist -o "${outputPath}" "${url}"`;

    await execPromise(downloadCmd, {
      timeout: 300000, // 5 minutes timeout
      maxBuffer: 10 * 1024 * 1024 // 10MB buffer
    });

    // Find downloaded file
    const files = fs.readdirSync(downloadsDir);
    const downloadedFile = files.find(f => f.startsWith(`youtube_${videoId}`));

    if (!downloadedFile) {
      throw new Error('Download completed but file not found');
    }

    const actualPath = path.join(downloadsDir, downloadedFile);

    // Get video title
    let title = 'YouTube Video';
    try {
      const titleCmd = `${ytdlpCommand} --get-title --no-playlist "${url}"`;
      const titleOutput = await execPromise(titleCmd, { timeout: 10000 });
      title = titleOutput.stdout.trim() || title;
    } catch (e) {
      console.log('Could not get title:', e.message);
    }

    return {
      path: actualPath,
      title: title,
      duration: 0
    };

  } catch (error) {
    console.error('yt-dlp download failed:', error.message);
    // Directly throw the error so the user knows why it failed
    throw new Error(`Download failed: ${error.message}. Please try again later.`);
  }
}

// Download TikTok video (using API approach)
async function downloadTikTok(url, chatId) {
  try {
    // Using a public TikTok API service
    const apiUrl = `https://api16-normal-useast5.us.tiktokv.com/aweme/v1/play/?video_id=`;

    // For TikTok, we'll use yt-dlp if available, otherwise fallback to API
    const videoId = Date.now();
    const outputPath = path.join(downloadsDir, `tiktok_${videoId}.mp4`);

    try {
      // Try using yt-dlp (if installed)
      let ytdlpCommand = 'yt-dlp';
      try {
        await execPromise('which yt-dlp');
      } catch {
        ytdlpCommand = 'python3 -m yt_dlp';
      }
      await execPromise(`${ytdlpCommand} -o "${outputPath}" "${url}"`);

      if (fs.existsSync(outputPath)) {
        return {
          path: outputPath,
          title: 'TikTok Video',
          duration: 0
        };
      }
    } catch (error) {
      console.log('yt-dlp not available, trying alternative method...');
    }

    // Alternative: Use TikTok API
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      maxRedirects: 5
    });

    // This is a simplified approach - in production, you'd need proper TikTok API
    throw new Error('TikTok download requires yt-dlp. Please install: pip install yt-dlp');
  } catch (error) {
    throw new Error(`TikTok download failed: ${error.message}`);
  }
}

// Download Instagram video
async function downloadInstagram(url, chatId) {
  try {
    const videoId = Date.now();
    const outputPath = path.join(downloadsDir, `instagram_${videoId}.mp4`);

    try {
      // Try using yt-dlp (if installed)
      let ytdlpCommand = 'yt-dlp';
      try {
        await execPromise('which yt-dlp');
      } catch {
        ytdlpCommand = 'python3 -m yt_dlp';
      }
      await execPromise(`${ytdlpCommand} -o "${outputPath}" "${url}"`);

      if (fs.existsSync(outputPath)) {
        return {
          path: outputPath,
          title: 'Instagram Video',
          duration: 0
        };
      }
    } catch (error) {
      console.log('yt-dlp not available, trying alternative method...');
    }

    // Alternative method using Instagram API (simplified)
    throw new Error('Instagram download requires yt-dlp. Please install: pip install yt-dlp');
  } catch (error) {
    throw new Error(`Instagram download failed: ${error.message}`);
  }
}

// Main download handler
async function handleDownload(url, chatId, messageId) {
  const platform = detectPlatform(url);

  if (!platform) {
    await bot.sendMessage(chatId, '❌ Unsupported platform. Supported: YouTube, TikTok, Instagram');
    return;
  }

  let statusMsg;
  try {
    statusMsg = await bot.sendMessage(chatId, `⏳ Downloading from ${platform}...`, {
      reply_to_message_id: messageId
    });
  } catch (err) {
    console.error('Failed to send status message:', err);
    return;
  }

  try {
    let result;

    // Update status every 10 seconds for long downloads
    const statusInterval = setInterval(async () => {
      try {
        await bot.editMessageText(`⏳ Still downloading from ${platform}... Please wait.`, {
          chat_id: chatId,
          message_id: statusMsg.message_id
        });
      } catch (e) {
        // Ignore edit errors
      }
    }, 10000);

    try {
      switch (platform) {
        case 'youtube':
          result = await downloadYouTube(url, chatId);
          break;
        case 'tiktok':
          result = await downloadTikTok(url, chatId);
          break;
        case 'instagram':
          result = await downloadInstagram(url, chatId);
          break;
        default:
          throw new Error('Unsupported platform');
      }
    } finally {
      clearInterval(statusInterval);
    }

    // Check if file exists
    if (!fs.existsSync(result.path)) {
      throw new Error('Downloaded file not found');
    }

    // Check file size (Telegram limit is 50MB)
    const stats = fs.statSync(result.path);
    const fileSizeInMB = stats.size / (1024 * 1024);

    if (fileSizeInMB > 50) {
      await bot.editMessageText('❌ File is too large (>50MB). Telegram has a file size limit.', {
        chat_id: chatId,
        message_id: statusMsg.message_id
      });
      cleanupFile(result.path);
      return;
    }

    // Send video
    try {
      await bot.editMessageText('✅ Uploading video...', {
        chat_id: chatId,
        message_id: statusMsg.message_id
      });
    } catch (e) {
      console.log('Could not edit message:', e.message);
    }

    const videoStream = fs.createReadStream(result.path);
    await bot.sendVideo(chatId, videoStream, {
      caption: `📹 ${result.title}\n\nDownloaded via VideoSave Bot`,
      reply_to_message_id: messageId
    });

    try {
      await bot.deleteMessage(chatId, statusMsg.message_id);
    } catch (e) {
      console.log('Could not delete status message:', e.message);
    }
    cleanupFile(result.path);

  } catch (error) {
    console.error('Download error:', error);
    try {
      await bot.editMessageText(
        `❌ Error: ${error.message}\n\n💡 Tip: Install yt-dlp for better reliability:\npip install yt-dlp\n\nOr try: pip3 install yt-dlp`,
        {
          chat_id: chatId,
          message_id: statusMsg.message_id
        }
      );
    } catch (editError) {
      // If editing fails, try sending a new message
      try {
        await bot.sendMessage(chatId, `❌ Error: ${error.message}\n\n💡 Tip: Install yt-dlp: pip install yt-dlp`);
      } catch (sendError) {
        console.error('Failed to send error message:', sendError);
      }
    }
  }
}

// Bot commands
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  console.log(`📨 Received /start from chat ${chatId}`);
  const welcomeMessage = `
🎥 *Welcome to VideoSave Bot!*

I can download videos from:
• YouTube
• TikTok  
• Instagram

*How to use:*
Just send me a video link from any supported platform!

*Commands:*
/start - Show this message
/help - Get help
/supported - Show supported platforms

*Note:* For TikTok and Instagram, make sure yt-dlp is installed on the server.
  `;

  bot.sendMessage(chatId, welcomeMessage, { parse_mode: 'Markdown' })
    .then(() => console.log(`✅ Sent welcome message to chat ${chatId}`))
    .catch(err => console.error(`❌ Error sending message:`, err));

  // Also prompt to join channel on start
  checkSubscription(msg.from.id).then(isSubscribed => {
    if (!isSubscribed) {
      bot.sendMessage(chatId, `⚠️ *Please Note:*\n\nYou need to join ${REQUIRED_CHANNEL} to download videos.`, {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [[
            { text: "📢 Join Channel", url: `https://t.me/${REQUIRED_CHANNEL.replace('@', '')}` }
          ]]
        }
      });
    }
  });
});

bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  const helpMessage = `
📖 *Help Guide*

*How to download videos:*
1. Copy a video URL from YouTube, TikTok, or Instagram
2. Send the URL to this bot
3. Wait for the download to complete
4. Receive your video!

*Supported Platforms:*
• YouTube (youtube.com, youtu.be)
• TikTok (tiktok.com, vm.tiktok.com)
• Instagram (instagram.com)

*File Size Limit:*
Telegram has a 50MB file size limit. Larger videos cannot be sent.

*Need more help?*
Just send a video link and I'll try to download it!
  `;

  bot.sendMessage(chatId, helpMessage, { parse_mode: 'Markdown' });
});

bot.onText(/\/supported/, (msg) => {
  const chatId = msg.chat.id;
  const supportedMessage = `
✅ *Supported Platforms:*

• *YouTube*
  - youtube.com/watch?v=...
  - youtu.be/...

• *TikTok*
  - tiktok.com/@user/video/...
  - vm.tiktok.com/...

• *Instagram*
  - instagram.com/p/...
  - instagram.com/reel/...

Just send me a link from any of these platforms!
  `;

  bot.sendMessage(chatId, supportedMessage, { parse_mode: 'Markdown' });
});

// Handle text messages (URLs)
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  console.log(`📨 Received message from chat ${chatId}:`, text ? text.substring(0, 50) : '(no text)');

  // Skip if it's a command (handled by onText handlers)
  if (text && text.startsWith('/')) {
    return;
  }

  // Check if message contains a URL
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const urls = text ? text.match(urlRegex) : null;

  if (urls && urls.length > 0) {

    // Check subscription before downloading
    const isSubscribed = await checkSubscription(msg.from.id);
    if (!isSubscribed) {
      await bot.sendMessage(chatId, `❌ *Access Denied*\n\nYou must subscribe to our channel to use this bot.\n\n👉 Join here: ${REQUIRED_CHANNEL}`, {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [[
            { text: "📢 Join Channel", url: `https://t.me/${REQUIRED_CHANNEL.replace('@', '')}` }
          ]]
        }
      });
      return;
    }

    const url = urls[0];
    console.log(`🔗 Detected URL: ${url}`);
    await handleDownload(url, chatId, msg.message_id);
  } else if (text && !text.startsWith('/')) {
    // If it's text but not a URL, provide helpful message
    console.log(`💬 Sending help message to chat ${chatId}`);
    await bot.sendMessage(
      chatId,
      '📎 Please send me a video URL from YouTube, TikTok, or Instagram.\n\nExample: https://www.youtube.com/watch?v=...',
      { reply_to_message_id: msg.message_id }
    ).catch(err => console.error(`❌ Error sending help message:`, err));
  }
});

// Handle errors - prevent bot from crashing
bot.on('polling_error', (error) => {
  console.error('❌ Polling error:', error.message);
  // Don't exit - keep the bot running
  if (error.code === 'EFATAL') {
    console.error('Fatal polling error, but continuing...');
  }
});

bot.on('error', (error) => {
  console.error('❌ Bot error:', error.message);
  // Don't exit - keep the bot running
});

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error.message);
  console.error('Stack:', error.stack);
  // Don't exit - keep the bot running
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't exit - keep the bot running
});

// Test bot connection
bot.getMe().then((botInfo) => {
  console.log('✅ Bot connected successfully!');
  console.log(`🤖 Bot username: @${botInfo.username}`);
  console.log(`📛 Bot name: ${botInfo.first_name}`);
  console.log('📱 Bot is ready to receive messages...');
  console.log('');
  console.log('💡 Test the bot by sending /start in Telegram');
}).catch((error) => {
  console.error('❌ Failed to connect to Telegram API:', error);
  console.error('Please check your BOT_TOKEN in .env file');
  process.exit(1);
});

