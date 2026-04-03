FROM node:20

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy backend source code
COPY . .

# Expose port
EXPOSE 5000

# Start the app with nodemon for development
CMD ["npm", "run", "dev"]
