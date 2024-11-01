# Use an official Node.js image with Alpine
FROM node:18-alpine

# Set working directory
WORKDIR /app/frontend

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all other project files
COPY . .

# Expose the port for development server
EXPOSE 9000

# Command to start the development server
CMD ["npm", "run", "dev"]
