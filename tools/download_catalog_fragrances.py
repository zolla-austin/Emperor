"""Download and optimise the 14 user-supplied fragrance images once.

Run from the project root:
    python tools/download_catalog_fragrances.py

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
    "golden-amber-discovery-set": "https://images.unsplash.com/photo-1622618991746-fe6004db3a47?w=1800&auto=format&fit=max&q=90",
    "ysl-libre-le-parfum": "https://images.unsplash.com/photo-1723391962154-8a2b6299bc09?w=1800&auto=format&fit=max&q=90",
    "valentino-uomo-born-in-roma-intense": "https://images.unsplash.com/photo-1724271859348-bad4e179d65d?w=1800&auto=format&fit=max&q=90",
    "versace-eros-eau-de-toilette": "https://images.unsplash.com/photo-1595389294696-ae969ff733a8?w=1800&auto=format&fit=max&q=90",
    "sunlit-amber-eau-de-parfum": "https://media.istockphoto.com/id/2220697718/photo/a-golden-bottle-of-perfume-in-a-sunbeam.webp?a=1&b=1&s=612x612&w=0&k=20&c=hSmEk2iZpTjXBWYyz4MxCf33LkaiTX-rXmTV6S0oeaY=",
    "versace-eros-eau-de-parfum": "https://images.unsplash.com/photo-1674469296659-adfe02dba6a1?w=1800&auto=format&fit=max&q=90",
    "givenchy-gentleman-eau-de-parfum": "https://images.unsplash.com/photo-1780943004155-1b2c5424fb2e?w=1800&auto=format&fit=max&q=90",
    "versace-eros-parfum": "https://images.unsplash.com/photo-1674469295330-7a4d6f090f77?w=1800&auto=format&fit=max&q=90",
    "alfa-monte-heredero": "https://images.unsplash.com/photo-1771762013405-ad64577dfc55?w=1800&auto=format&fit=max&q=90",
    "fig-noir-eau-de-parfum": "https://plus.unsplash.com/premium_photo-1757614255517-a73613e4d6a6?w=1800&auto=format&fit=max&q=90",
    "kilian-black-phantom": "https://images.unsplash.com/photo-1661980376805-4676812bdf1c?w=1800&auto=format&fit=max&q=90",
    "versace-crystal-noir-eau-de-parfum": "https://images.unsplash.com/photo-1676902005584-54c949f934a9?w=1800&auto=format&fit=max&q=90",
    "dior-sauvage-eau-de-parfum-60ml": "https://images.unsplash.com/photo-1698877577733-65ae7dee328c?w=1800&auto=format&fit=max&q=90",
    "dior-sauvage-eau-de-parfum-100ml": "https://images.unsplash.com/photo-1747916147834-afe35b0d95ac?w=1800&auto=format&fit=max&q=90",
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
            raise FileExistsError(f"Refusing to overwrite existing image: {destination}")

        print(f"Downloading {slug}")
        save_webp(download(url), destination)
        print(f"Saved {destination.relative_to(ROOT)} ({destination.stat().st_size:,} bytes)")


if __name__ == "__main__":
    main()
