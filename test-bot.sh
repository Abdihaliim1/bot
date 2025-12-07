#!/bin/bash

echo "🤖 Telegram Bot Setup & Test Script"
echo "===================================="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo ""
    echo "📝 To create it, follow these steps:"
    echo "1. Open Telegram and search for @BotFather"
    echo "2. Send /newbot and follow instructions"
    echo "3. Copy your bot token"
    echo "4. Run this command:"
    echo "   echo 'BOT_TOKEN=your_token_here' > .env"
    echo ""
    echo "Or manually create .env file with:"
    echo "BOT_TOKEN=your_actual_bot_token"
    echo ""
    exit 1
fi

# Check if BOT_TOKEN is set
source .env
if [ -z "$BOT_TOKEN" ] || [ "$BOT_TOKEN" == "your_bot_token_here" ]; then
    echo "❌ BOT_TOKEN not set or still has placeholder value!"
    echo "Please edit .env file and add your actual bot token"
    exit 1
fi

echo "✅ .env file found"
echo "✅ BOT_TOKEN is set"
echo ""
echo "🚀 Starting bot..."
echo "Press Ctrl+C to stop"
echo ""

# Start the bot
node bot.js

