# ========================================
# Build Stage
# ========================================
# Use Node 22-alpine (Closer to your local v24 version to reduce conflicts)
FROM node:22-alpine AS build
WORKDIR /app

# Copy package files first to leverage Docker cache
COPY package*.json ./

# Use 'npm install' instead of 'ci'.
# 'ci' fails if the lockfile version (from Node 24) doesn't perfectly match Docker's Node version.
# 'install' is more forgiving and will generate a compatible tree.
RUN npm install

# Copy source code (This will respect .dockerignore and skip node_modules)
COPY . .

# Build the app
RUN npm run build

# ========================================
# Production Stage
# ========================================
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Remove default nginx static assets
RUN rm -rf ./*

# Copy built assets from the 'build' stage
COPY --from=build /app/build .

# Copy your custom nginx configuration
# Ensure your nginx.conf handles React Router (try_files $uri /index.html)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Health check (Standard Nginx check)
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80 || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]