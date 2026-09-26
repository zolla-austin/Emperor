"""Download and optimise the 15 user-supplied Couture suit images once.

Run from the project root:
    python tools/download_catalog_suits.py

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
    "the-mayfair-sage": "https://images.unsplash.com/photo-1715418554358-d34e420b18ab?w=1800&auto=format&fit=max&q=90",
    "the-victorian-regent": "https://media.istockphoto.com/id/161821608/photo/proud-strange-and-elegant-portrait.webp?a=1&b=1&s=612x612&w=0&k=20&c=zgIaRYV9HhCyPKNksnwYFuUFWL8pkMoC8kHiz-3jKqU=",
    "the-silver-duke": "https://images.unsplash.com/photo-1775257796092-59d2247d12b7?w=1800&auto=format&fit=max&q=90",
    "the-heritage-baron": "https://images.unsplash.com/photo-1775257796023-64e5bb47d046?w=1800&auto=format&fit=max&q=90",
    "the-ashford-three-piece": "https://images.unsplash.com/photo-1609840170480-4c440bcd5d8f?w=1800&auto=format&fit=max&q=90",
    "the-ember-chancellor": "https://images.unsplash.com/photo-1679101893310-9b9adb4b733b?w=1800&auto=format&fit=max&q=90",
    "the-western-sovereign": "https://images.unsplash.com/photo-1700688000392-90042ad7f974?w=1800&auto=format&fit=max&q=90",
    "the-chestnut-noble": "https://images.unsplash.com/photo-1741709845643-89b3e1738218?w=1800&auto=format&fit=max&q=90",
    "the-midnight-pinstripe": "https://images.unsplash.com/photo-1741709847227-53768cdfb8f7?w=1800&auto=format&fit=max&q=90",
    "the-silver-statesman": "https://plus.unsplash.com/premium_photo-1661717925598-f9763e74fe22?w=1800&auto=format&fit=max&q=90",
    "the-tailors-council": "https://images.unsplash.com/photo-1745824793757-a2451f8ad7a8?w=1800&auto=format&fit=max&q=90",
    "the-rose-diplomat": "https://plus.unsplash.com/premium_photo-1769290472467-0d3b26ba5609?w=1800&auto=format&fit=max&q=90",
    "the-lavender-executive": "https://plus.unsplash.com/premium_photo-1760612414300-4a1e49a8cae5?w=1800&auto=format&fit=max&q=90",
    "the-sepia-atelier": "https://images.unsplash.com/photo-1580568287125-ae9bad4f0eef?w=1800&auto=format&fit=max&q=90",
    "the-golden-maverick": "https://media.istockphoto.com/id/1183150649/photo/stylish-hipster-senior-man.webp?a=1&b=1&s=612x612&w=0&k=20&c=Z4a3yvH3m8OhJgSIZH_OYxVCcgGCRHYNhf9zvxL580E=",
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
