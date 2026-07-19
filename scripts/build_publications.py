"""One-off script: convert the Google Scholar CSV export into data/publications.json.
Not part of the runtime site; kept here for reference if the publication list needs
to be regenerated from a fresh CSV export later."""
import csv
import json
import os
import re

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CSV_PATH = os.path.join(BASE, "Resources", "Google Scholar All Publications",
                         "Faruk All Publications from google Scholar.csv")
OUT_PATH = os.path.join(BASE, "data", "publications.json")

# Any of these substrings in the authors field is "him" -- bold it in the UI.
NAME_PATTERNS = [
    r"Faruk,\s*Md\.?\s*Farukuzzaman",
    r"Faruk,\s*Md\s*Farukuzzarnan",  # CSV typo variant seen in one row
    r"Faruk,\s*Farukuzzaman",
    r"Farukuzzaman,\s*Md\.?\s*Faruk",  # never actually appears, safety net
]
NAME_RE = re.compile("|".join(NAME_PATTERNS))

BEST_PAPER_TITLE = "K-mer Based DNA Methylation Status Prediction Using Support Vector Machine"


def split_authors(raw):
    # authors are semicolon-separated, trailing "; " artifacts possible
    parts = [p.strip() for p in raw.split(";") if p.strip()]
    return parts


def main():
    with open(CSV_PATH, newline="", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        rows = list(reader)

    pubs = []
    for i, row in enumerate(rows):
        authors_raw = row["Authors"].strip()
        authors_list = split_authors(authors_raw)
        authors_display = "; ".join(
            (f"**{a}**" if NAME_RE.search(a) else a) for a in authors_list
        )
        year_raw = (row.get("Year") or "").strip()
        try:
            year = int(year_raw)
        except ValueError:
            year = None

        award = BEST_PAPER_TITLE.lower() in row["Title"].strip().lower() and "IEEE Bangladesh Section Best Paper Award" or None

        pubs.append({
            "id": i + 1,
            "authorsDisplay": authors_display,
            "title": row["Title"].strip(),
            "venue": row["Publication"].strip(),
            "volume": (row.get("Volume") or "").strip() or None,
            "number": (row.get("Number") or "").strip() or None,
            "pages": (row.get("Pages") or "").strip() or None,
            "year": year,
            "publisher": (row.get("Publisher") or "").strip() or None,
            "award": award,
        })

    # Sort newest first; stable so same-year entries keep CSV relative order
    pubs.sort(key=lambda p: (p["year"] if p["year"] is not None else -1), reverse=True)
    for idx, p in enumerate(pubs):
        p["id"] = idx + 1

    with open(OUT_PATH, "w", encoding="utf-8") as f:
        json.dump(pubs, f, indent=2, ensure_ascii=False)

    print(f"Wrote {len(pubs)} publications to {OUT_PATH}")
    awarded = [p for p in pubs if p["award"]]
    print(f"Award-flagged entries: {len(awarded)}")
    for p in awarded:
        print(" -", p["title"], p["year"])


if __name__ == "__main__":
    main()
