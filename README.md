# Elsewhere

A static, image-led field guide and worldbuilding archive.

## Preview locally

Serve the repository root with any static file server. For example:

```sh
python3 -m http.server 4173
```

Then open `http://localhost:4173`.

## Structure

- `index.html` — editorial home and field index
- `articles/` — long-form wiki entries
- `assets/images/` — generated Elsewhere photography
- `assets/styles.css` — complete visual system

The site has no build step or runtime dependencies and can be hosted on any static host.
