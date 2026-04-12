# Use official lightweight Node.js image
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install dependencies (copy package files first for better layer caching)
COPY package*.json ./

# Install only production dependencies to keep the image small
RUN npm install --production

# Copy app source
COPY . .

# Expose the port the app listens on
EXPOSE 3000

# Start the app
CMD ["node", "app.js"]
