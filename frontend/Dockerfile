# Use Node.js 18 for compatibility and stability
FROM node:18

# Set working directory
WORKDIR /app

# Copy only package.json and package-lock.json first (for Docker caching efficiency)
COPY package*.json ./

# Install dependencies in a clean, consistent way
RUN npm ci

# Copy the rest of the frontend project
COPY . .

# Expose the port used by Vite
EXPOSE 3000

# Start the development server
CMD ["npm", "run", "dev", "--", "--host"]
