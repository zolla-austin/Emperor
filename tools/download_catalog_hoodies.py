"""Download and optimise the user-supplied hoodie images once.

Run from the project root:
    python tools/download_catalog_hoodies.py
"""

from io import BytesIO
from pathlib import Path
from urllib.request import Request, urlopen

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1]
IMAGES_DIR = ROOT / "images"

ASSETS = {
    "the-palm-white": "https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?w=1800&auto=format&fit=max&q=90",
    "the-double-white": "https://media.istockphoto.com/id/1455756788/photo/blank-sweatshirt-mock-up-front-and-back-view-isolated-on-white-plain-white-hoodie-mockup.webp?a=1&b=1&s=612x612&w=0&k=20&c=LO4n-xpPN_tTJzzntbqHblLKqZkial0KvyZoi4HUufY=",
    "the-heather-flatlay": "https://media.istockphoto.com/id/1248493407/photo/white-hoody-mock-up-copy-space-for-print-design.webp?a=1&b=1&s=612x612&w=0&k=20&c=96IJBMmd2Xw7flHlTXMBCSDpjdaXPvt3ZQ_jTsPZB54=",
    "the-white-crew-sweat": "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=1800&auto=format&fit=max&q=90",
    "the-quiet-white": "https://images.unsplash.com/photo-1738486260590-23c954cf29b8?w=1800&auto=format&fit=max&q=90",
    "the-ivory-crew": "https://plus.unsplash.com/premium_photo-1690034979579-ba49f5b8f15b?w=1800&auto=format&fit=max&q=90",
    "toxic-peeps-hoodie": "https://images.unsplash.com/photo-1571821324176-52ff15e96348?w=1800&auto=format&fit=max&q=90",
    "the-cable-turtleneck": "https://images.unsplash.com/photo-1687275160744-6cb5bb16544a?w=1800&auto=format&fit=max&q=90",
    "the-charcoal-hood": "https://images.unsplash.com/photo-1607860087860-c46e865f6ab0?w=1800&auto=format&fit=max&q=90",
    "the-ivory-knit-set": "https://images.unsplash.com/photo-1605131545453-6044234368a6?w=1800&auto=format&fit=max&q=90",
    "the-white-lounge-set": "https://plus.unsplash.com/premium_photo-1690034979146-59a98168f27e?w=1800&auto=format&fit=max&q=90",
    "the-amber-hood": "https://images.unsplash.com/photo-1571754338920-1ba712024258?w=1800&auto=format&fit=max&q=90",
    "the-cobalt-oversize": "https://images.unsplash.com/photo-1735251186841-2ed286f02990?w=1800&auto=format&fit=max&q=90",
}


def download(url: str) -> bytes:
    request = Request(url, headers={"User-Agent": "EMPEROR-catalog-asset-prep/1.0"})
    with urlopen(request, timeout=120) as response:
        return response.read()


def save_webp(raw_bytes: bytes, destination: Path) -> None:
    with Image.open(BytesIO(raw_bytes)) as source:
        image = ImageOps.exif_transpose(source).convert("RGB")
        image.thumbnail((1800, 1800), Image.Resampling.LANCZOS)
        image.save(destination, "WEBP", quality=82, method=6)


def main() -> None:
    IMAGES_DIR.mkdir(exist_ok=True)

    for slug, url in ASSETS.items():
        destination = IMAGES_DIR / f"{slug}.webp"
        if destination.exists():
            print(f"Skipping existing image: {destination.relative_to(ROOT)}", flush=True)
            continue

        print(f"Downloading {slug}", flush=True)
        save_webp(download(url), destination)
        print(f"Saved {destination.relative_to(ROOT)} ({destination.stat().st_size:,} bytes)", flush=True)


if __name__ == "__main__":
    main()
