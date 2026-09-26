"""Download and optimise the user-supplied Accessories Cabinet images once.

Run from the project root:
    python tools/download_catalog_accessories.py

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
    "the-ruby-regalia": "https://plus.unsplash.com/premium_photo-1787614767073-80ffbe399e40?w=1800&auto=format&fit=max&q=90",
    "the-gold-collar-parure": "https://plus.unsplash.com/premium_photo-1768611321168-69baabbe28f3?w=1800&auto=format&fit=max&q=90",
    "the-obsidian-boston": "https://images.unsplash.com/photo-1705909237050-7a7625b47fac?w=1800&auto=format&fit=max&q=90",
    "the-ivory-satchel": "https://images.unsplash.com/photo-1711548244653-72219aa9ac27?w=1800&auto=format&fit=max&q=90",
    "the-emerald-expedition": "https://plus.unsplash.com/premium_photo-1680384369784-552d0be2038e?w=1800&auto=format&fit=max&q=90",
    "the-cognac-envoy": "https://images.unsplash.com/photo-1691480150204-66dd1eb77391?w=1800&auto=format&fit=max&q=90",
    "rolex-datejust": "https://images.unsplash.com/photo-1620625515032-6ed0c1790c75?w=1800&auto=format&fit=max&q=90",
    "the-four-sovereigns": "https://plus.unsplash.com/premium_photo-1728759436968-db4b52249ffa?w=1800&auto=format&fit=max&q=90",
    "omega-speedmaster": "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=1800&auto=format&fit=max&q=90",
    "iwc-portugieser-chronograph": "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=1800&auto=format&fit=max&q=90",
    "tissot-chronograph": "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=1800&auto=format&fit=max&q=90",
    "the-open-heart-regent": "https://images.unsplash.com/photo-1731700576319-13c807e33b63?w=1800&auto=format&fit=max&q=90",
    "the-gold-tourbillon": "https://images.unsplash.com/photo-1740342432952-376ce35d8862?w=1800&auto=format&fit=max&q=90",
    "the-tan-minimal": "https://images.unsplash.com/photo-1661980377011-61e36f7bd9d2?w=1800&auto=format&fit=max&q=90",
    "rolex-submariner-date-yellow-gold": "https://images.unsplash.com/photo-1730757679771-b53e798846cf?w=1800&auto=format&fit=max&q=90",
    "rolex-submariner-date": "https://images.unsplash.com/photo-1662384197911-e82189f4dc60?w=1800&auto=format&fit=max&q=90",
    "rolex-submariner-date-cerachrom": "https://images.unsplash.com/photo-1698612059734-280fed56f417?w=1800&auto=format&fit=max&q=90",
    "rolex-cosmograph-daytona": "https://images.unsplash.com/photo-1587865501868-36104829d7db?w=1800&auto=format&fit=max&q=90",
    "montblanc-1858": "https://images.unsplash.com/photo-1694442139405-28866401a322?w=1800&auto=format&fit=max&q=90",
    "the-rose-diamond-wrist": "https://images.unsplash.com/photo-1751437761644-460ae92e34c9?w=1800&auto=format&fit=max&q=90",
    "rolex-datejust-yellow-gold": "https://media.istockphoto.com/id/1023491066/photo/classic-gold-watch-on-black-background.webp?a=1&b=1&s=612x612&w=0&k=20&c=iSkyJPT_zSGvm3VVS0zgen7DzB_0f60pfD5Kyug88hE=",
    "the-gold-perpetual": "https://media.istockphoto.com/id/157398698/photo/clockwork-orange-gold.webp?a=1&b=1&s=612x612&w=0&k=20&c=fN6C5FDuebR8-SWK43vCQyUoyyLO2Tp6mx4fcENQ23k=",
    "rolex-datejust-oystersteel-gold": "https://media.istockphoto.com/id/172380146/photo/gold-watch.webp?a=1&b=1&s=612x612&w=0&k=20&c=UzJwtyy4dZJxPAhmLPNG78-gGBX4vWYAVjfmrQcIC2A=",
    "the-imperial-pocket-watch": "https://media.istockphoto.com/id/157618978/photo/golden-pocket-watch-isolated-on-white.webp?a=1&b=1&s=612x612&w=0&k=20&c=lQc2cgw068j_d6EHgPgEiP0kVZKm2bnTSaqgRN0ctVI=",
    "the-optical-cabinet": "https://images.unsplash.com/photo-1486250944723-86bca2b15b06?w=1800&auto=format&fit=max&q=90",
    "the-ebony-spectacles": "https://images.unsplash.com/photo-1556306510-31ca015374b0?w=1800&auto=format&fit=max&q=90",
    "the-octagon-spectacles": "https://images.unsplash.com/photo-1749525694688-03217cfbc52e?w=1800&auto=format&fit=max&q=90",
    "the-amethyst-cat-eye": "https://images.unsplash.com/photo-1697827321284-9d0ad4f1b3fc?w=1800&auto=format&fit=max&q=90",
    "the-round-legend": "https://images.unsplash.com/photo-1633621641966-23836fcafd7a?w=1800&auto=format&fit=max&q=90",
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
            print(f"Skipping existing image: {destination.relative_to(ROOT)}")
            continue

        print(f"Downloading {slug}")
        save_webp(download(url), destination)
        print(f"Saved {destination.relative_to(ROOT)} ({destination.stat().st_size:,} bytes)")


if __name__ == "__main__":
    main()
