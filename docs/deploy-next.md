# Preview site: next.zuacaldeira.com

The redesign is previewed at https://next.zuacaldeira.com. A push to the `next` branch runs
`.github/workflows/deploy-next.yml`: tests, production build, `robots.txt` replaced with
`Disallow: /`, rsync to `/var/www/next.zuacaldeira.com/` as `deploy-zuacaldeira`, then a
`curl` check. The live site (`main` → zuacaldeira.com) is not touched.

The host is the shared VPS `217.154.2.230` (about 18 sites, system nginx, certbot with the
webroot `/var/www/certbot` and a renewal timer). Never bind anything to :80/:443 other than
through the host nginx.

## One-time setup

1. **DNS** (Strato, the zone's name servers are `*.rzone.de`): an A record
   `next.zuacaldeira.com → 217.154.2.230`. `zuacaldeira.com` has no AAAA record, so none for
   `next` either. Check: `dig +short next.zuacaldeira.com` prints `217.154.2.230`.

2. **Web root**, on the server as root:
   ```bash
   install -d -o deploy-zuacaldeira -g deploy-zuacaldeira -m 755 /var/www/next.zuacaldeira.com
   ```

3. **HTTP only first,** so certbot can answer the challenge. Install only the port-80
   server block of `infra/nginx/next.zuacaldeira.com.conf` (the map and the :443 block refer
   to a certificate that does not exist yet):
   ```bash
   cat > /etc/nginx/sites-available/next.zuacaldeira.com <<'EOF'
   server {
       listen 80;
       listen [::]:80;
       server_name next.zuacaldeira.com;
       location /.well-known/acme-challenge/ { root /var/www/certbot; }
       location / { return 301 https://next.zuacaldeira.com$request_uri; }
   }
   EOF
   ln -s /etc/nginx/sites-available/next.zuacaldeira.com /etc/nginx/sites-enabled/
   nginx -t && systemctl reload nginx
   ```

4. **Certificate:**
   ```bash
   certbot certonly --webroot -w /var/www/certbot -d next.zuacaldeira.com
   ```

5. **Full site:** copy `infra/nginx/next.zuacaldeira.com.conf` to
   `/etc/nginx/sites-available/next.zuacaldeira.com`, then `nginx -t && systemctl reload nginx`.

6. **First deploy:** push `next`. The workflow uses the existing secrets `DEPLOY_SSH_KEY` and
   `DEPLOY_HOST`; `deploy-zuacaldeira` already owns the new web root.

7. **Check:**
   ```bash
   curl -sI https://next.zuacaldeira.com/          # 200, X-Robots-Tag: noindex, nofollow
   curl -sI https://next.zuacaldeira.com/home/     # 200, HSTS and CSP present
   curl -s  https://next.zuacaldeira.com/robots.txt  # Disallow: /
   ```

## Later
- **Old-URL redirects (D2 in `docs/examples/home.md`):** `301` from `/home`, `/about`, ... to
  `/en/...`, added to this config once the language routes exist, and to the live config at
  launch.
- **Backend:** the Spring Boot service and its MySQL are not deployed yet; how they run on
  this host is still to decide.

## Teardown
`rm /etc/nginx/sites-enabled/next.zuacaldeira.com && nginx -t && systemctl reload nginx`, then
optionally `certbot delete --cert-name next.zuacaldeira.com` and remove the web root.
