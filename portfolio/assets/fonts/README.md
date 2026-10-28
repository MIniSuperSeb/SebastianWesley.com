# Local font assets

Latin variable WOFF2 subsets from Google Fonts, downloaded October 27, 2026:

- Big Shoulders Display v24, weights 700–900
- Instrument Sans v4, weights 400–600
- JetBrains Mono v24, weights 400–500
- Pixelify Sans v3, weights 400–600

The accompanying OFL files contain each family's copyright and license.
`site.css` declares the fonts; every page preloads the display face. All other
characters use the existing system fallbacks. Preserve versioned filenames when
updating fonts because Cloudflare serves these files with immutable caching.
