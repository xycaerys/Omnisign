from __future__ import annotations

import logging
from functools import lru_cache
from pathlib import Path
from typing import Any

from utils.config import settings

logger = logging.getLogger(__name__)


@lru_cache(maxsize=1)
def load_gesture_model(model_path: str | Path | None = None) -> Any | None:
    """Load the upstream Keras model lazily.

    The referenced project ships `cnn8grps_rad1_model.h5`. This backend keeps
    loading optional so local API development and text-to-sign flows do not fail
    when that large model file is not present yet.
    """
    path = Path(model_path or settings.model_path)
    if not path.exists():
        logger.warning("Gesture model not found at %s; using keypoint fallback.", path)
        return None

    try:
        from tensorflow.keras.models import load_model
    except Exception as exc:  # pragma: no cover - depends on optional runtime
        logger.exception("TensorFlow/Keras is unavailable: %s", exc)
        return None

    try:
        model = load_model(path, compile=False)
        logger.info("Loaded gesture model from %s", path)
        return model
    except Exception as exc:  # pragma: no cover - depends on model file
        logger.exception("Failed to load gesture model from %s: %s", path, exc)
        return None
