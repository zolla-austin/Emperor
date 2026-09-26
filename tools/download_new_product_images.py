"""Download and optimise the nine Stage E Unsplash assets once."""

from io import BytesIO
from pathlib import Path
from urllib.request import Request, urlopen

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1]
IMAGES_DIR = ROOT / "images"

PHOTOS = {
    "imperial-reserve": ("photo-1611146264101-358a3b387eee", "_3cLB_mvVTw", "Filip Baotić"),
    "crown-of-lagos": ("photo-1592914567648-d818927b1c0b", "sJw6seLVOlA", "Laura Chouette"),
    "gilded-sceptre": ("photo-1770301410072-f6ef6dad65b2", "rJ5V8qAOQc0", "Camila Cordeiro"),
    "the-midnight-regent": ("photo-1580656940647-8854a00547f0", "MZbZQEx91Ek", "Alexander Naglestad"),
    "the-golden-council": ("photo-1598915850252-fb07ad1e6768", "FML0kjSSmQc", "Tanya Barrow"),
    "the-regent-cufflinks": ("photo-1760545183045-3995fbf19c3c", "Zlkf_wMQGic", "Ivan Aviles"),
    "sovereign-silk-bow-tie": ("photo-1612088179423-2f2638c86db1", "3F1n1v42DX4", "Joice Kelly"),
    "imperial-crest-pocket-square": ("photo-1685306717197-728608ad91d5", "NFUTqf1CGFk", "Luwadlin Bosman"),
    "crownkeeper-leather-belt": ("photo-1603805752838-aa579d77da72", "Cg-aEozbir8", "Julia Kicova"),
}


def download_photo(image_id):
    url = f"https://images.unsplash.com/{image_id}?auto=format&fit=crop&w=1800&q=85"
    request = Request(url, headers={"User-Agent": "EMPEROR-catalog-asset-prep/1.0"})
    with urlopen(request, timeout=90) as response:
        return response.read()


def optimise_webp(raw_bytes, destination):
    with Image.open(BytesIO(raw_bytes)) as source:
        image = ImageOps.exif_transpose(source).convert("RGB")
        image.thumbnail((1800, 1800), Image.Resampling.LANCZOS)
        image.save(destination, "WEBP", quality=82, method=6)


def main():
    IMAGES_DIR.mkdir(exist_ok=True)

    for slug, (image_id, _photo_id, _photographer) in PHOTOS.items():
        destination = IMAGES_DIR / f"{slug}.webp"
        if destination.exists():
            raise FileExistsError(f"Refusing to overwrite existing image: {destination}")

        print(f"Downloading {slug}")
        optimise_webp(download_photo(image_id), destination)
        print(f"Saved {destination.relative_to(ROOT)} ({destination.stat().st_size:,} bytes)")


if __name__ == "__main__":
    main()
