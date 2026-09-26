"""Download and optimise the user-supplied Couture T-shirt images once.

Run from the project root:
    python tools/download_catalog_tees.py

The generated WebP files are static site assets. Netlify does not run this
script.
"""

from io import BytesIO
from pathlib import Path
from urllib.request import Request, urlopen

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1]
IMAGES_DIR = ROOT / "images"

ASSETS = {
    "the-emperor-letter": "https://images.unsplash.com/photo-1746980497737-5b948805e2e4?w=1800&auto=format&fit=max&q=90",
    "the-white-crew": "https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=1800&auto=format&fit=max&q=90",
    "the-white-oversize": "https://images.unsplash.com/photo-1646176724329-8a12512df18b?w=1800&auto=format&fit=max&q=90",
    "the-saffron-crew": "https://images.unsplash.com/photo-1665873880246-b657384cdacd?w=1800&auto=format&fit=max&q=90",
    "the-noir-crew": "https://plus.unsplash.com/premium_photo-1689531916407-d64dedd6126d?w=1800&auto=format&fit=max&q=90",
    "the-breton-stripe": "https://images.unsplash.com/photo-1768696081821-426e320a387e?w=1800&auto=format&fit=max&q=90",
    "the-coastal-stripe": "https://plus.unsplash.com/premium_photo-1732117941235-88c5cff5f3eb?w=1800&auto=format&fit=max&q=90",
    "the-petrol-crew": "https://media.istockphoto.com/id/2238532179/photo/petrol-blue-cotton-t-shirt.webp?a=1&b=1&s=612x612&w=0&k=20&c=a-VOegMpYtUXmj27zNxJn_Y-IZwDCsaxvQzxh1Yz6Ck=",
    "the-atelier-white": "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=1800&auto=format&fit=max&q=90",
    "the-fivefold-crew": "https://plus.unsplash.com/premium_photo-1673356302067-aac3b545a362?w=1800&auto=format&fit=max&q=90",
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
