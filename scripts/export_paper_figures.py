"""Export the figure PDFs referenced by example.tex for the project website.

Run with the shared environment, for example on Windows:
    E:/labwork/codex/.venv/Scripts/python.exe scripts/export_paper_figures.py

Requires Poppler's pdftoppm, PyMuPDF, and Pillow. The source PDFs and their
data are preserved. The attention-mask crop matches example.tex's 16 pt trim.
"""

from __future__ import annotations

import argparse
from pathlib import Path
import re
import shutil
import subprocess
import tempfile

import fitz
from PIL import Image


# (PDF relative to paper root, website PNG filename, output width, vertical trim)
FIGURES = (
    ("figs/teaser/teaser_v3_cropped.pdf", "fig_teaser.png", 2800, 0),
    ("figs/lift_method/arch.pdf", "fig_arch.png", 2400, 0),
    ("figs/lift_method/mask.pdf", "fig_mask.png", 2000, 16),
    ("figs/lift_method/system.pdf", "fig_system.png", 2400, 0),
    (
        "figs/online_learning_curves/x5_steps_final_score_offline.pdf",
        "fig_learning_curves.png",
        2800,
        0,
    ),
    (
        "figs/online_learning_curves/x5_residual_policy_steps_final_score.pdf",
        "fig_residual_policy.png",
        2800,
        0,
    ),
    (
        "figs/online_learning_curves/x5_towel_steps_offline_online_ratio_ablation.pdf",
        "fig_mixing_ratio.png",
        2000,
        0,
    ),
    (
        "figs/online_learning_curves/reactive_generalization_bars.pdf",
        "fig_generalization_bars.png",
        2800,
        0,
    ),
    ("figs/gen_settings/gen_settings.pdf", "fig_gen_settings.png", 2400, 0),
)


def main() -> None:
    website_root = Path(__file__).resolve().parents[1]
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--paper-root", type=Path, default=website_root.parent)
    parser.add_argument(
        "--output-dir", type=Path, default=website_root / "static" / "images"
    )
    args = parser.parse_args()

    renderer = shutil.which("pdftoppm")
    if renderer is None:
        raise SystemExit("Poppler's pdftoppm must be available on PATH.")

    tex = (args.paper_root / "example.tex").read_text(encoding="utf-8")
    # Ignore commented-out figures so an obsolete export cannot silently recur.
    tex = re.sub(r"(?<!\\)%[^\n]*", "", tex)
    referenced = set(re.findall(r"\\includegraphics(?:\[[^\]]*\])?\{([^}]+)\}", tex))
    for source, *_ in FIGURES:
        if source not in referenced:
            raise SystemExit(f"Figure is no longer referenced by example.tex: {source}")
        if not (args.paper_root / source).is_file():
            raise SystemExit(f"Missing source PDF: {source}")

    args.output_dir.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix="lift-website-figures-") as scratch:
        for source, filename, width, trim_pt in FIGURES:
            pdf_path = args.paper_root / source
            with fitz.open(pdf_path) as pdf:
                if len(pdf) != 1:
                    raise ValueError(f"Expected a single-page figure: {source}")
                page_width = pdf[0].rect.width

            prefix = Path(scratch) / Path(filename).stem
            subprocess.run(
                [
                    renderer,
                    "-f", "1",
                    "-singlefile",
                    "-cropbox",
                    "-png",
                    "-scale-to-x", str(width),
                    "-scale-to-y", "-1",
                    str(pdf_path),
                    str(prefix),
                ],
                check=True,
            )
            destination = args.output_dir / filename
            with Image.open(prefix.with_suffix(".png")) as rendered:
                figure = rendered.convert("RGB")
                if trim_pt:
                    trim_px = round(trim_pt * width / page_width)
                    figure = figure.crop((0, trim_px, figure.width, figure.height - trim_px))
                figure.save(destination, optimize=True)
                print(
                    f"{filename}: {figure.width}x{figure.height}, "
                    f"{destination.stat().st_size:,} bytes <- {source}"
                )


if __name__ == "__main__":
    main()
