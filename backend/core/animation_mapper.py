from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from utils.config import settings


class AnimationMapper:
    def __init__(self, library_path: Path | None = None) -> None:
        self.library_path = library_path or settings.animation_library_path
        self.library = self._load_library()

    def _load_library(self) -> dict[str, list[dict[str, Any]]]:
        with self.library_path.open("r", encoding="utf-8") as file:
            return json.load(file)

    def map_tokens(self, tokens: list[str]) -> list[dict[str, Any]]:
        animation: list[dict[str, Any]] = []
        cursor = 0.0
        for token in tokens:
            frames = self.library.get(token, self.library.get("UNKNOWN", []))
            for frame in frames:
                mapped = dict(frame)
                mapped["time"] = round(float(mapped.get("time", 0)) + cursor, 3)
                animation.append(mapped)
            if frames:
                cursor = round(animation[-1]["time"] + 0.2, 3)
        return animation


def expression_flags(text: str) -> dict[str, bool]:
    lowered = text.lower()
    return {
        "raised_eyebrows": "?" in text,
        "headshake": bool({"no", "not", "never"}.intersection(lowered.replace("?", " ").split())),
    }
