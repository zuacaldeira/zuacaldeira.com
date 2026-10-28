# The prerendered site, served by an unprivileged nginx on :8080.
# On the shared VPS the host nginx terminates TLS and proxies to it (infra/next/).

FROM node:22-bookworm-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npx ng build --configuration production

# The site root is the prerendered home page; 404.html is the prerendered 404 route.
RUN cd dist/zuacaldeira-com/browser \
 && cp home/index.html index.html \
 && (cp 404/index.html 404.html || true) \
 && rm -f CNAME

# PREVIEW=true keeps the build out of search results (next.zuacaldeira.com).
ARG PREVIEW=false
RUN if [ "$PREVIEW" = "true" ]; then \
      printf 'User-agent: *\nDisallow: /\n' > dist/zuacaldeira-com/browser/robots.txt; \
    fi

FROM nginxinc/nginx-unprivileged:1.27-alpine
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/zuacaldeira-com/browser /usr/share/nginx/html
EXPOSE 8080
