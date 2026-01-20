# Use official Node.js image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy only the Next.js app folder
COPY eduvexa ./eduvexa

# Move into Next.js app directory
WORKDIR /app/eduvexa

# Install dependencies
COPY eduvexa/package*.json ./
RUN npm install

# Copy remaining files
COPY eduvexa ./

# Build the app
RUN npm run build

# Expose Next.js port
EXPOSE 3000

# Start the app
CMD ["npm", "run", "start"]
