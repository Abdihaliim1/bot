# Use Node.js as the base image
FROM node:18-slim

# Install Python3, pip, and ffmpeg
# We need python3 for yt-dlp and ffmpeg for media conversion
RUN apt-get update && \
    apt-get install -y python3 python3-pip ffmpeg && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Install yt-dlp via pip to get the latest version
# Using --break-system-packages because we are in a container and want to install globally
RUN python3 -m pip install -U yt-dlp --break-system-packages

# Create app directory
WORKDIR /usr/src/app

# Copy package files first for caching
COPY package*.json ./

# Install app dependencies
RUN npm install --production

# Copy bot source code
COPY . .

# Create downloads directory
RUN mkdir -p downloads

# Set environment variables
ENV NODE_ENV=production

# Start the bot
CMD ["node", "bot.js"]
