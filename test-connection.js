// Quick test script to verify bot connection
require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

const token = process.env.BOT_TOKEN;

if (!token) {
  console.error('❌ BOT_TOKEN not found in .env file');
  process.exit(1);
}

console.log('🔍 Testing bot connection...');
console.log(`Token: ${token.substring(0, 15)}...`);

const bot = new TelegramBot(token, { polling: false });

bot.getMe()
  .then((botInfo) => {
    console.log('✅ Bot connection successful!');
    console.log(`🤖 Bot username: @${botInfo.username}`);
    console.log(`📛 Bot name: ${botInfo.first_name}`);
    console.log(`🆔 Bot ID: ${botInfo.id}`);
    console.log('');
    console.log('✅ Your bot is ready! You can now start it with: npm start');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Connection failed!');
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response:', error.response.body);
    }
    process.exit(1);
  });

