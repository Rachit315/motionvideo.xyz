"""Make the film's effects in code with earshot forge, judged against real CC0 references.

Run with the earshot venv:  ~/.local/share/earshot/.venv/bin/python audio/forge_sfx.py
Writes audio/forged/<recipe>/ (WAVs + report.json). Every reference is a CC0 Freesound recording
found through Openverse (audio/refs/<recipe>/); none of them is used in the mix.
"""
import sys
from pathlib import Path

from earshot.forge import forge

ROOT = Path(__file__).resolve().parent
JOBS = {
    # one quiet laptop keyboard for the search typing
    "keypress": dict(target="a soft single laptop keyboard key press", alts=["a mouse click", "a typewriter key"]),
    # one click voice for the film (the press that opens a video)
    "click": dict(target="a crisp single trackpad or mouse click", alts=["a keyboard key press", "a camera shutter"]),
    # the directory rail flick
    "whoosh": dict(target="a fast short clean air whoosh", alts=["a wind gust", "a sword swing"]),
    # the logo mark landing and the counter lock
    "impact": dict(target="a soft deep felt thud impact", alts=["a door slam", "an explosion"]),
    "pop": dict(target="a soft short wooden pop tick", alts=["a balloon burst", "a gunshot"]),
}

only = set(sys.argv[1:])
for recipe, spec in JOBS.items():
    if only and recipe not in only:
        continue
    out = ROOT / "forged" / recipe
    out.mkdir(parents=True, exist_ok=True)
    forge(
        recipe,
        refs=[str(p) for p in sorted((ROOT / "refs" / recipe).iterdir())],
        budget=64,
        keep=3,
        tone=1.5,
        robust=2,
        out=str(out),
        **spec,
    )
    print(f"forged {recipe} -> {out}", flush=True)
