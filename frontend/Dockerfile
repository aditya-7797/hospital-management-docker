# Stage 1: Build React app
FROM node:20 as builder

WORKDIR /app

# Copy package files and install all dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy source code and build the app
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]


