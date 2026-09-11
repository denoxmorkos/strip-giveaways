# Token Guide — Legal Ways to Get Stripchat Tokens (2026 & 2027)

An educational, compliance-first static landing page for adults (18+) that explains
**legal ways to get Stripchat tokens**, embeds a YouTube guide video, warns about
token scams, and presents external promotional websites transparently.

Live site: **https://denoxmorkos.github.io/strip-giveaways/** (after Pages deployment)

> **Compliance summary:** no hacks, generators, exploits, or unauthorized automation
> are promoted. No free tokens are guaranteed. No official Stripchat partnership is
> claimed. Promotional links are labeled and use
> `rel="nofollow sponsored noopener noreferrer"`.

## Project structure

```
.
├── index.html                  # Main landing page (video, article, offers, chat, FAQ)
├── styles.css                  # All styles (mobile-first, dark theme, print, reduced-motion)
├── script.js                   # Nav toggle, promo bar, rule-based chat assistant
├── assets/
│   ├── img-secure-payment.svg  # Secure payment illustration
│   ├── img-token-rewards.svg   # Token/reward illustration (also OG image)
│   ├── img-scam-warning.svg    # Scam-warning illustration
│   ├── img-mobile-guide.svg    # Mobile guide illustration
│   ├── icon.svg                # Source token icon
│   ├── icon-192.png            # PWA/manifest-size icon
│   ├── icon-512.png            # PWA/manifest-size icon
│   └── apple-touch-icon.png    # Apple touch icon (180px)
├── 404.html                    # Custom not-found page
├── robots.txt                  # Crawler rules + sitemap reference
├── sitemap.xml                 # URL list for search engines
├── .nojekyll                   # Serve assets as-is on GitHub Pages
├── privacy.html                # Placeholder privacy policy (replace before launch)
├── terms.html                  # Placeholder terms of use (replace before launch)
├── affiliate-disclosure.html   # Affiliate/promotional disclosure
├── contact.html                # Placeholder contact page
├── report.html                 # Report-a-suspicious-offer guidance
└── .github/workflows/deploy.yml# Validate + deploy to GitHub Pages
```

## Local development

No build step — plain HTML/CSS/vanilla JS.

```bash
# Option 1: any static server
python3 -m http.server 8080
# then open http://localhost:8080/

# Option 2: Node
npx serve .
```

## Deployment (GitHub Pages via Actions)

1. Push to `main` (or open a PR into `main`). The workflow
   `.github/workflows/deploy.yml` runs validation, then deploys.
2. Pages is enabled automatically by the workflow (`configure-pages` with
   `enablement: true`). If that ever fails, go to **Settings → Pages** and set
   **Source: GitHub Actions** manually.
3. The site is served from `https://<owner>.github.io/<repo>/`.

Manual checks before pushing:

```bash
node --check script.js
python3 -c "import xml.dom.minidom; xml.dom.minidom.parse('sitemap.xml')"
grep -c 'alt=' index.html            # every image needs alt text
```

Enable Pages with the GitHub CLI (one-time):

```bash
gh api -X POST repos/OWNER/REPO/pages -f build_type=workflow
gh run watch --repo OWNER/REPO       # follow the deploy workflow
```

## SEO notes

- **Title (≤60 chars):** `Legal Ways to Get Stripchat Tokens in 2026 & 2027`
- **Meta description (~150–160 chars):** see `<head>` in `index.html`.
- Canonical, Open Graph, Twitter Card, `robots.txt`, `sitemap.xml`, and
  JSON-LD (`Article`, `VideoObject`, `FAQPage`) are included.
- Semantic HTML5, one H1, descriptive alt text, lazy-loaded media,
  privacy-enhanced YouTube embed (`youtube-nocookie.com`, no autoplay).

## Affiliate disclosure

Some links point to external promotional websites
(`stripfreetokens.com`, `striptokens.live`, `striptks.live`). They are labeled
as promotions, open in a new tab with
`rel="nofollow sponsored noopener noreferrer"`, and never guarantee tokens or
imply official affiliation. Full text: `affiliate-disclosure.html` and the
footer of every page.

## Editable placeholders

| Placeholder        | Current value                                          | Where            |
|--------------------|--------------------------------------------------------|------------------|
| `SITE_URL`         | `https://denoxmorkos.github.io/strip-giveaways/`       | head, sitemap    |
| `PAGE_URL`         | `https://denoxmorkos.github.io/strip-giveaways/`       | canonical, JSON-LD |
| `SITE_NAME`        | `Token Guide`                                          | head, JSON-LD    |
| `AUTHOR_NAME`      | `Token Guide Editorial Team`                           | byline, JSON-LD  |
| `PUBLISH_DATE`     | `2026-09-11`                                           | byline, JSON-LD  |
| `MODIFIED_DATE`    | `2026-09-11` (`Last reviewed`)                         | byline, JSON-LD  |
| `CONTACT_PLACEHOLDER` | _add a real contact method_                         | contact.html, privacy.html |

## How to change the YouTube video

1. Replace the video ID `dV5TPGsnc7I` in `index.html`:
   - the `<iframe src="https://www.youtube-nocookie.com/embed/…">`,
   - the fallback link `https://youtu.be/…`,
   - the `VideoObject` JSON-LD (`embedUrl`, `contentUrl`, `thumbnailUrl`).
2. Update the iframe `title` and the `VideoObject` `name`/`description`.
3. Keep `loading="lazy"`, `allowfullscreen`, and no autoplay parameters.

## How to change promotional links

- Main offer cards: search `index.html` for `stripfreetokens.com`,
  `striptokens.live`, `striptks.live` (cards + sticky bar + chat `OFFER_URL` in `script.js`).
- Keep `target="_blank"` and `rel="nofollow sponsored noopener noreferrer"`.
- Keep the per-card disclosure and the page-level promotional disclosure.
- Never add claims of guaranteed tokens or official affiliation.

## How to configure a custom domain

1. Add a `CNAME` file at the repo root containing the domain (e.g. `guide.example.com`).
2. In **Settings → Pages → Custom domain**, enter the same domain and enforce HTTPS.
3. At your DNS provider, point the domain to GitHub Pages
   (`A` records `185.199.108.153` … `.111` for apex, or `CNAME <owner>.github.io` for `www`).
4. Update `SITE_URL`/`PAGE_URL`, canonical URLs, sitemap, and JSON-LD.
5. Do not modify DNS without explicit permission from the domain owner.
