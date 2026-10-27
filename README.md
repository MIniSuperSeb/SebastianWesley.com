# sebastianwesley.com

Personal portfolio site for Sebastian Wesley. Static HTML, CSS and JS (GSAP + ScrollTrigger + Lenis), no framework and no build step.

- `portfolio/` is the published site: one HTML file per page, with shared `assets/site.css` and `assets/site.js`.
- Hosted on Cloudflare as a Worker serving static assets; see `wrangler.jsonc`.

## Preview locally

```bash
python3 -m http.server 8787 --directory portfolio
```

## Deploy

```bash
npx wrangler deploy
```
