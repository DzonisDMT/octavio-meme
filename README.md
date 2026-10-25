# $OCTAVIO

Static landing page for the **$OCTAVIO** community meme coin.

Catchphrase: **Just an Octavio running a node.**

Community meme only — not affiliated with Minima Global, Arm, or Siemens. Do not add copy that says those organizations endorse, partner with, or are affiliated with the coin, notrandom, or PixelLotto.

## Preview locally

From this folder:

```bash
python3 -m http.server 8765
```

Open http://127.0.0.1:8765/

## Edit the contract address

Open `js/config.js` and change `ca`.

- Leave `ca` as `"[CA]"` until the real address exists. The Copy CA control stays in a **Coming soon** state and does not copy a placeholder into the clipboard.
- When the coin is live, set `ca` to the exact address published on notrandom.fun. Both Copy CA buttons then copy that string.

There is one config value. The hero and the Buy section both read it.

## PixelLotto link

PixelLotto is a community MiniDapp on Minima. The card stays **Coming soon** and has **no URL** until you add one.

In `js/config.js`, set `pixellottoUrl` to the real `http://` or `https://` URL. An empty string keeps the card unlinked. The same instruction is in the HTML comment marked `PIXELLOTTO_URL` in `index.html`, above the PixelLotto card.

Do not invent a placeholder link.

Docs only, not a public download or site URL:

- Package name: `pixellotto-1.1.9.mds.zip`
- Claim page inside that package: `claim.html`

## GitHub Pages

The site is set up to publish from the **main** branch, **root** folder (`/`), not `/docs`.

`.nojekyll` is in the repo so Pages serves the images and static files as-is.

After Pages is turned on, the site URL is:

https://dzonisdmt.github.io/octavio-meme/

This environment cannot change repository Pages settings (the API returns 403). Turn it on once:

1. Open **Settings → Pages** for [DzonisDMT/octavio-meme](https://github.com/DzonisDMT/octavio-meme/settings/pages).
2. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
3. Choose branch **main** and folder **/ (root)**.
4. Save. The first deploy can take a minute.

Later pushes to `main` publish on their own.

## What is on the page

- Home: ticker, catchphrase, Buy on notrandom, contract control, first-post art
- Story: 16 origin beats and their images
- Meme wall: Drake meme, plus short community captions
- Community MiniDapps: PixelLotto rules, coming-soon card, no public URL
- Roadmap: Phase 3 MiniDapps mentions PixelLotto
- Buy: notrandom.fun, contract placeholder, share-fee labels (informational, not a promise of returns)
- Footer: catchphrase and the affiliation disclaimer

## Assets

Unpacked from the project upload:

- `images/octavio-beat-01.jpg` … `octavio-beat-16.jpg`
- `x/octavio-first-post.jpg` (hero)
- `x/octavio-drake-meme-2048.jpg` (meme wall)
- `x/octavio-x-banner-1500x500.jpg` (social preview image)
- `story-beats.md` and `x-posts-20.md` (source notes)

`site-mock` was a visual reference and is not part of the site.

## Edit copy

Page text lives in `index.html`. Story captions follow `story-beats.md`. Keep Octavio as he/him. Do not add an Octavia storyline.
