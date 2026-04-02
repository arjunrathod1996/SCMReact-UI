# Stage 1: Build
FROM node:18-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Nginx
FROM nginx:stable-alpine

# Remove default config
RUN rm -f /etc/nginx/conf.d/default.conf

# Copy correct nginx config (server block only)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Clean default html
RUN rm -rf /usr/share/nginx/html/*

# Copy build output
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]