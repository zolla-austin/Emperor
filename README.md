# Emperor

Emperor is a luxury portfolio for fragrance, tailoring, and accessories, based in Lagos. The site presents the house collection through a home page and dedicated sections for fragrance, couture, accessories, and the lookbook, with a page for each piece.

## Tech stack

Plain HTML, CSS, and JavaScript. There is no framework and no build step.

## Folder structure

- `data/` — site configuration and the product catalog
- `css/` — stylesheets
- `js/` — client-side behavior
- `images/` — product photography, lookbook images, and icons
- `items/` — individual product pages
- `tools/` — local scripts used to prepare pages and assets
- `legacy/` — the original site, kept for reference

Pages at the repository root include `index.html`, `fragrance.html`, `couture.html`, `accessories.html`, `lookbook.html`, `about.html`, and `contact.html`.

## Run locally

From the project root:

```bash
python -m http.server
```

Then open [http://localhost:8000/](http://localhost:8000/) (or open `index.html` through that address). Serving the folder over HTTP keeps the pages, scripts, and images loading together.

## Live site

[https://emperor001.netlify.app/](https://emperor001.netlify.app/)

## Legacy

`legacy/` contains the original pre-rebuild site, kept for reference. The current site is the set of files at the repository root.
