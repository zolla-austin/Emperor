"""Create the legacy backup and optimized image assets for EMPEROR.

Run once from the project root:
    python tools/prepare_assets.py

The site does not import this script and Netlify does not need to run it.
"""

from __future__ import annotations

import base64
import hashlib
import io
import re
import shutil
from pathlib import Path

from PIL import Image, ImageOps


PROJECT_ROOT = Path(__file__).resolve().parent.parent
SOURCE_HTML = PROJECT_ROOT / "index.html"
IMAGES_DIR = PROJECT_ROOT / "images"
LEGACY_DIR = PROJECT_ROOT / "legacy"

LEGACY_FILES = (
    "index.html",
    "index_clean.html",
    "products.js",
    "images.js",
    "extract_images.py",
    "clean_html.py",
)

IMAGE_FILENAMES = (
    "oba-noir.webp",
    "imagination.webp",
    "sovereign-rain.webp",
    "seduction-royale.webp",
    "skincare-campaign.webp",
    "wonder-cream.webp",
    "cerave-cream.webp",
    "hydra-aura-mask.webp",
    "cicaplast-baume.webp",
    "collagen-snail-cream.webp",
    "cerave-daily-essentials-set.webp",
    "the-emperor-suit.webp",
    "the-white-sovereign.webp",
    "the-lagos-classic.webp",
    "emperor-oversized-tee.webp",
    "wings-of-royalty-tee.webp",
    "hustle-culture-tee.webp",
    "emperor-flannel-shirt.webp",
    "emperor-signature-hoodie.webp",
    "emperor-monogram-polo.webp",
    "lookbook-the-emperor-suit.webp",
    "lookbook-oba-noir.webp",
    "lookbook-emperor-signature-hoodie.webp",
    "lookbook-seduction-royale.webp",
    "lookbook-the-white-sovereign.webp",
    "lookbook-emperor-monogram-polo.webp",
    "lookbook-sovereign-rain.webp",
    "lookbook-hustle-culture-tee.webp",
    "lookbook-the-lagos-classic.webp",
)

DATA_IMAGE_PATTERN = re.compile(
    r'src="data:image/(?P<format>jpeg|jpg|png|webp);base64,(?P<data>[^"]+)"',
    flags=re.IGNORECASE,
)

FALLBACK_SVG = """\
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1500" role="img" aria-labelledby="title desc">
  <title id="title">EMPEROR image unavailable</title>
  <desc id="desc">A black and gold EMPEROR placeholder</desc>
  <defs>
    <radialGradient id="glow" cx="50%" cy="42%" r="60%">
      <stop offset="0" stop-color="#302814"/>
      <stop offset="1" stop-color="#0a0a0c"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="1500" fill="url(#glow)"/>
  <rect x="36" y="36" width="1128" height="1428" fill="none" stroke="#d4af37" stroke-opacity=".45" stroke-width="2"/>
  <text x="600" y="710" fill="#d4af37" font-family="Georgia, serif" font-size="78" letter-spacing="20" text-anchor="middle">EMPEROR</text>
  <text x="600" y="785" fill="#f8f4ec" fill-opacity=".55" font-family="Arial, sans-serif" font-size="22" letter-spacing="8" text-anchor="middle">LAGOS</text>
</svg>
"""


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as file:
        for chunk in iter(lambda: file.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def create_legacy_backup() -> None:
    LEGACY_DIR.mkdir(exist_ok=True)
    for filename in LEGACY_FILES:
        source = PROJECT_ROOT / filename
        destination = LEGACY_DIR / filename
        if not source.exists():
            raise FileNotFoundError(f"Missing legacy source: {source}")

        if destination.exists():
            if sha256(source) != sha256(destination):
                raise RuntimeError(
                    f"Legacy backup differs from {filename}; refusing to overwrite it."
                )
            continue

        shutil.copy2(source, destination)


def extract_and_optimize_images() -> tuple[int, int]:
    html = SOURCE_HTML.read_text(encoding="utf-8")
    matches = list(DATA_IMAGE_PATTERN.finditer(html))
    if len(matches) != len(IMAGE_FILENAMES):
        raise RuntimeError(
            f"Expected {len(IMAGE_FILENAMES)} embedded images, found {len(matches)}."
        )

    IMAGES_DIR.mkdir(exist_ok=True)
    original_bytes = 0
    optimized_bytes = 0

    for match, filename in zip(matches, IMAGE_FILENAMES, strict=True):
        raw_image = base64.b64decode(match.group("data"))
        original_bytes += len(raw_image)

        with Image.open(io.BytesIO(raw_image)) as source:
            image = ImageOps.exif_transpose(source)
            image.thumbnail((1800, 1800), Image.Resampling.LANCZOS)

            if image.mode not in ("RGB", "RGBA"):
                image = image.convert("RGBA" if "transparency" in image.info else "RGB")

            destination = IMAGES_DIR / filename
            image.save(destination, "WEBP", quality=82, method=6)
            optimized_bytes += destination.stat().st_size

    (IMAGES_DIR / "fallback.svg").write_text(FALLBACK_SVG, encoding="utf-8")
    return original_bytes, optimized_bytes


def main() -> None:
    create_legacy_backup()
    original_bytes, optimized_bytes = extract_and_optimize_images()
    reduction = 100 - ((optimized_bytes / original_bytes) * 100)

    print(f"Legacy files preserved: {len(LEGACY_FILES)}")
    print(f"Images optimized: {len(IMAGE_FILENAMES)}")
    print(f"Embedded source size: {original_bytes / 1024 / 1024:.2f} MB")
    print(f"Optimized WebP size: {optimized_bytes / 1024 / 1024:.2f} MB")
    print(f"Size reduction: {reduction:.1f}%")


if __name__ == "__main__":
    main()
