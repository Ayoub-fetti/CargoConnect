# Use Node 20+ because Expo/Metro uses modern Array helpers (e.g. toReversed)
FROM node:20-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Expose the Expo development server ports
EXPOSE 19000 19001 19002

# Start the Expo development server
CMD ["npx", "expo", "start", "--tunnel"]