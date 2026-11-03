# The prerendered site, served by an unprivileged nginx on :8080.
# On the shared VPS the host nginx terminates TLS and proxies to it (infra/next/).
#
# The site is built before this image, with the build's own backend
# (.github/workflows/build-site.yml, D26); the image only packs dist/zuacaldeira-com/browser.
# Locally: compose.build.yml up, npm run content, npm run build, then docker build frontend.

FROM nginxinc/nginx-unprivileged:1.27-alpine
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY dist/zuacaldeira-com/browser /usr/share/nginx/html
EXPOSE 8080
