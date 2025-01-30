FROM node:18-alpine

WORKDIR /app

# Add python and build dependencies for potential native modules
RUN apk add --no-cache python3 make g++ curl

COPY package*.json ./

# Install dependencies with increased memory limit
RUN npm install --max-old-space-size=2048

COPY . .

# Build TypeScript code with increased memory limit
RUN NODE_OPTIONS=--max-old-space-size=2048 npm run build

EXPOSE 3000

# Add HOST environment variable
ENV HOST=0.0.0.0

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=30s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:${PORT:-3000}/health || exit 1

# Change the start command to include proper error handling
CMD ["node", "--max-old-space-size=2048", "--trace-warnings", "--unhandled-rejections=strict", "dist/server.js"] 