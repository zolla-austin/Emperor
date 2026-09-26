"""Download the four polo-section studio images once.

Run from the project root:
    python tools/download_catalog_polos.py
"""

from io import BytesIO
from pathlib import Path
from urllib.request import Request, urlopen

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1]
IMAGES_DIR = ROOT / "images"

ASSETS = {
    "the-navy-rib-stripe": "https://plus.unsplash.com/premium_photo-1778901737190-3e2a8e2ad957?w=1800&auto=format&fit=max&q=90",
    "the-saffron-ringer": "https://plus.unsplash.com/premium_photo-1778901739747-30aeb7aa1a11?w=1800&auto=format&fit=max&q=90",
    "the-clay-white": "https://plus.unsplash.com/premium_photo-1718913936342-eaafff98834b?w=1800&auto=format&fit=max&q=90",
    "the-noir-studio": "https://plus.unsplash.com/premium_photo-1690820317560-128817f442cc?w=1800&auto=format&fit=max&q=90",
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
