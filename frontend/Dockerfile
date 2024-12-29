# Use a Node version that supports modern features (e.g., Node 18+)
FROM node:18

# Create app directory in container
WORKDIR /app

# Copy package.json and package-lock.json (if exists)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy your entire project (including tsconfig.json, src/, etc.)
COPY . .

# Build the Vite project (will run tsc automatically if you have "build": "tsc && vite build" in package.json)
RUN npm run build

# Install serve (or use another server) to serve the dist folder
#RUN npm install -g serve

# Expose port 3000 so we can access it on localhost
EXPOSE 3000

# Command to serve the production build
#CMD ["serve", "-s", "dist", "-l", "3000"]
CMD ["npm", "run", "dev", "--", "--host"]
