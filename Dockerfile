# =========================================================
# FRANKENSTEIN TRIKES — Static Site Dockerfile
# Serves the static HTML/CSS/JS via nginx
# =========================================================
FROM nginx:1.27-alpine

# Remove default nginx site
RUN rm -rf /usr/share/nginx/html/*

# Copy static site into nginx web root
COPY . /usr/share/nginx/html/

# Basic nginx config tweak for HTML5 / clean caching
RUN printf 'server {\n\
  listen 80;\n\
  server_name _;\n\
  root /usr/share/nginx/html;\n\
  index index.html;\n\
\n\
  # Gzip\n\
  gzip on;\n\
  gzip_types text/plain text/css application/javascript application/json image/svg+xml;\n\
\n\
  # Cache images/fonts aggressively; CSS/JS must revalidate so deploys land\n\
  location ~* \\.(jpg|jpeg|png|gif|webp|svg|ico|woff2?)$ {\n\
    expires 30d;\n\
    add_header Cache-Control "public";\n\
  }\n\
  location ~* \\.(css|js)$ {\n\
    expires -1;\n\
    add_header Cache-Control "no-cache, must-revalidate";\n\
  }\n\
\n\
  # Pretty URLs / fallback\n\
  location / {\n\
    try_files $uri $uri/ $uri.html =404;\n\
  }\n\
}\n' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
