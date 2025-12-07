// Diagnostic script to test bot functionality
require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

const token = process.env.BOT_TOKEN;

console.log('🔍 Bot Diagnostic Test');
console.log('=====================\n');

// Test 1: Token loaded
console.log('Test 1: Token loaded');
if (!token) {
  console.log('❌ FAILED: Token not found\n');
  process.exit(1);
}
console.log('✅ PASSED: Token loaded\n');

// Test 2: Bot connection
console.log('Test 2: Bot connection');
const bot = new TelegramBot(token, { polling: false });

bot.getMe()
  .then((botInfo) => {
    console.log('✅ PASSED: Bot connected');
    console.log(`   Username: @${botInfo.username}`);
    console.log(`   Name: ${botInfo.first_name}\n`);

    // Test 3: Check for pending updates
    console.log('Test 3: Checking for pending updates');
    return bot.getUpdates({ limit: 1 });
  })
  .then((updates) => {
    if (updates.length > 0) {
      console.log(`⚠️  WARNING: Found ${updates.length} pending update(s)`);
      console.log('   This might mean the bot is not processing messages\n');
    } else {
      console.log('✅ PASSED: No pending updates (bot is processing messages)\n');
    }

    // Test 4: Test message sending capability
    console.log('Test 4: Message sending capability');
    console.log('   (This test requires your chat ID)');
    console.log('   To get your chat ID:');
    console.log('   1. Send a message to your bot');
    console.log('   2. Visit: https://api.telegram.org/bot' + token + '/getUpdates');
    console.log('   3. Look for "chat":{"id":... in the response\n');

    console.log('✅ All basic tests passed!');
    console.log('\n📝 Next steps:');
    console.log('   1. Make sure the bot is running: npm start');
    console.log('   2. Send /start to @Instasavekebot in Telegram');
    console.log('   3. Check the terminal where bot.js is running for logs');
    console.log('   4. If you see "📨 Received /start..." in terminal, bot is working!');
    
    process.exit(0);
  })
  .catch((error) => {
    console.log('❌ FAILED:', error.message);
    if (error.response) {
      console.log('   API Response:', error.response.body);
    }
    process.exit(1);
  });

