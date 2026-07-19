"""One-off script: copy + resize/compress source photos from Resources/ into
assets/img/... with clean web-friendly filenames. Not part of the runtime site;
kept here for reference if images ever need reprocessing."""
import os
from PIL import Image

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(BASE, "Resources")
DST = os.path.join(BASE, "assets", "img")

JOBS = [
    ("Main Profile Photo/FARUK Photo.jpg", "profile/faruk-profile.jpg", 900),
    ("Awards and Certificates/Certificates on Foundation Training On Teaching-Learning.jpg",
     "awards/foundation-training-teaching-learning.jpg", 1400),
    ("Awards and Certificates/Getting Research Award from VC for Fyscal Year 2021-22.jpg",
     "awards/vc-research-award-fy2021-22.jpg", 1400),
    ("Awards and Certificates/IEEE Best Paper Award at ICECTE 2019 Conference.jpeg",
     "awards/ieee-best-paper-award-icecte-2019.jpg", 1400),
    ("Some Professional Participation Photos/Award of Excellence at ULL at 2026 Spring 2026.jpeg",
     "awards/award-of-excellence-ull-spring-2026.jpg", 1400),
    ("Some Professional Participation Photos/Convocation at RUET at 2019.jpg",
     "gallery/convocation-ruet-2019.jpg", 1600),
    ("Some Professional Participation Photos/At the Orientation Program at ULL on Fall-2025 Semester With All New Students from Bangladesh.jpg",
     "gallery/orientation-ull-fall-2025.jpg", 1600),
    ("Some Professional Participation Photos/1st Industry-Academia Collaboration Meet at RUET-2023.jpg",
     "gallery/industry-academia-meet-ruet-2023.jpg", 1600),
    ("Some Professional Participation Photos/25th ICCIT International Conference at 2022.jpg",
     "gallery/iccit-25th-2022.jpg", 1600),
    ("Some Professional Participation Photos/4th ICECTE Conference at 2022.jpg",
     "gallery/icecte-4th-2022.jpg", 1600),
    ("Some Professional Participation Photos/At 26th ICECTE Conference at 2023.jpg",
     "gallery/icecte-26th-2023.jpg", 1600),
    ("Some Professional Participation Photos/At 27th ICECTE Conference 2024.jpg",
     "gallery/icecte-27th-2024.jpg", 1600),
    ("Some Professional Participation Photos/Infront of ULL Logo.jpg",
     "gallery/at-ull-campus.jpg", 1600),
]


def process(src_rel, dst_rel, max_w):
    src = os.path.join(SRC, src_rel)
    dst = os.path.join(DST, dst_rel)
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    im = Image.open(src)
    im = im.convert("RGB")
    if im.width > max_w:
        h = int(im.height * (max_w / im.width))
        im = im.resize((max_w, h), Image.LANCZOS)
    im.save(dst, "JPEG", quality=82, optimize=True)
    print(f"{src_rel} -> {dst_rel}  ({im.width}x{im.height}, {os.path.getsize(dst)//1024}KB)")


if __name__ == "__main__":
    for src_rel, dst_rel, max_w in JOBS:
        process(src_rel, dst_rel, max_w)

    # ULL logo: keep as PNG (transparency), copy as-is
    logo_src = os.path.join(SRC, "ULL Details", "ULL Logo.png")
    logo_dst = os.path.join(DST, "logos", "ull-logo.png")
    os.makedirs(os.path.dirname(logo_dst), exist_ok=True)
    Image.open(logo_src).save(logo_dst, "PNG", optimize=True)
    print(f"ULL Logo.png -> logos/ull-logo.png")
