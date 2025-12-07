#!/bin/bash

echo "🤖 Starting VideoSave Bot..."
echo "=============================="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    exit 1
fi

# Check if node_modules exists
if [ ! -d node_modules ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo "🚀 Starting bot..."
echo "Press Ctrl+C to stop the bot"
echo ""
echo "💡 Open Telegram and send /start to your bot: @Instasavekebot"
echo ""

# Start the bot in foreground so we can see logs
node bot.js

