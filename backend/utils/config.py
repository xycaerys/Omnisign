from __future__ import annotations

import os
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parents[1]
DATA_DIR = BASE_DIR / "data"


class Settings:
    app_name: str = "Bidirectional Sign Language API"
    app_version: str = "1.0.0"
    model_path: Path = Path(
        os.getenv("SIGN_MODEL_PATH", BASE_DIR / "cnn8grps_rad1_model.h5")
    )
    gesture_labels_path: Path = Path(
        os.getenv("GESTURE_LABELS_PATH", DATA_DIR / "gesture_labels.json")
    )
    animation_library_path: Path = Path(
        os.getenv("ANIMATION_LIBRARY_PATH", DATA_DIR / "animation_library.json")
    )
    smoothing_window_size: int = int(os.getenv("SMOOTHING_WINDOW_SIZE", "10"))
    smoothing_required_matches: int = int(os.getenv("SMOOTHING_REQUIRED_MATCHES", "8"))


settings = Settings()
