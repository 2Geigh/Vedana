# Build stage
FROM node:lts AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx expo export -p web

# Production stage
FROM nginx:alpine-slim AS prod
COPY --from=build /app/dist /usr/share/nginx/html

# SPA Routing configuration
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]