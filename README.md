# sebastianwesley.com

Personal portfolio site for Sebastian Wesley. Static HTML, CSS and JS (GSAP + ScrollTrigger + Lenis), no framework and no build step.

- `portfolio/` is the published site: one HTML file per page, with shared `assets/site.css` and `assets/site.js`.
- Hosted on Cloudflare as a Worker serving static assets; see `wrangler.jsonc`.
- Fonts and animation libraries are self-hosted under `portfolio/assets/fonts/`
  and `portfolio/assets/vendor/`, with their license notices. Versioned files in
  these directories use long-lived browser caching via `portfolio/_headers`;
  use new filenames when updating them.
- The homepage paints immediately on mobile. Desktop text entrances, animated
  pixel art, scroll effects and outgoing page transitions remain enabled.

## Preview locally

```bash
python3 -m http.server 8787 --directory portfolio
```

## Deploy

```bash
npx wrangler deploy
```
