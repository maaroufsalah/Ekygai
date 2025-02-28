# =======================
# 1) Build Stage
# =======================
FROM node:20-alpine AS build
WORKDIR /app

# Copy package.json and lock file, install dependencies
COPY package*.json ./
RUN npm ci

# Copy the rest of your Next.js code
COPY . .

# Build Next.js in production mode
RUN npm run build

# =======================
# 2) Production Stage
# =======================
FROM node:20-alpine
WORKDIR /app

# Copy built files from the build stage
COPY --from=build /app ./

# Expose port 3000 inside the container
EXPOSE 3000

# Instruct Next.js to listen on port 3000
ENV PORT=3000

# Start Next.js in production mode
CMD ["npm", "start"]
