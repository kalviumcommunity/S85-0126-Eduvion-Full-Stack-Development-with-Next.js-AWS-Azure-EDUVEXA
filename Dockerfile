# Stage 1: Build
FROM node:18-alpine AS builder
WORKDIR /app

# Install dependencies (use npm ci for reproducible installs)
COPY package*.json ./
RUN npm ci --omit=dev

# Copy source and build
COPY . .
RUN npm run build

# Stage 2: Run
FROM node:18-alpine
WORKDIR /app

# Copy built app from builder
COPY --from=builder /app .

ENV NODE_ENV=production
EXPOSE 3000

# Start the Next.js production server
CMD ["npm", "start"]
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
