from __future__ import annotations

import json
import logging
from dataclasses import dataclass
from pathlib import Path
from typing import Any

import numpy as np

from core.model_loader import load_gesture_model
from utils.config import settings

logger = logging.getLogger(__name__)


@dataclass(frozen=True)
class GesturePrediction:
    word: str
    confidence: float
    source: str


class GesturePredictor:
    """Reusable gesture predictor adapted from the upstream CNN flow.

    The original repository predicts one of eight visual groups using
    `cnn8grps_rad1_model.h5`, then resolves similar signs with landmark
    geometry. Here that logic is exposed as a service-friendly class instead of
    a GUI script.
    """

    def __init__(self, labels_path: Path | None = None) -> None:
        self.labels_path = labels_path or settings.gesture_labels_path
        self.labels = self._load_labels()
        self.model = load_gesture_model()

    def predict_gesture(
        self,
        keypoints: list[list[float]] | None = None,
        frame_data: list[Any] | None = None,
    ) -> GesturePrediction:
        if keypoints:
            normalized = self._normalize_keypoints(keypoints)
            model_prediction = self._predict_with_model(normalized)
            if model_prediction:
                return model_prediction
            return self._predict_with_keypoint_fallback(normalized)

        if frame_data:
            model_prediction = self._predict_with_frame(frame_data)
            if model_prediction:
                return model_prediction

        raise ValueError("Provide non-empty keypoints or frame_data.")

    def _load_labels(self) -> dict[str, Any]:
        with self.labels_path.open("r", encoding="utf-8") as file:
            return json.load(file)

    def _normalize_keypoints(self, keypoints: list[list[float]]) -> np.ndarray:
        points = np.asarray(keypoints, dtype=np.float32)
        if points.ndim != 2 or points.shape[1] not in (2, 3):
            raise ValueError("keypoints must be a list of [x, y, z] or [x, y] points.")
        if points.shape[0] < 5:
            raise ValueError("At least five hand keypoints are required.")

        if points.shape[1] == 2:
            points = np.pad(points, ((0, 0), (0, 1)), constant_values=0)

        wrist = points[0].copy()
        points = points - wrist
        scale = float(np.max(np.linalg.norm(points[:, :2], axis=1)))
        if scale > 0:
            points = points / scale
        return points

    def _predict_with_model(self, normalized: np.ndarray) -> GesturePrediction | None:
        if self.model is None:
            return None

        model_input = self._reshape_for_model(normalized)
        if model_input is None:
            return None

        probabilities = np.asarray(self.model.predict(model_input, verbose=0))[0]
        class_index = int(np.argmax(probabilities))
        confidence = float(probabilities[class_index])
        group_labels = self.labels.get("model_groups", [])
        group = group_labels[class_index] if class_index < len(group_labels) else "UNKNOWN"
        word = self._disambiguate_group(group, normalized)
        return GesturePrediction(word=word, confidence=round(confidence, 4), source="keras")

    def _reshape_for_model(self, normalized: np.ndarray) -> np.ndarray | None:
        input_shape = getattr(self.model, "input_shape", None)
        if not input_shape:
            return None

        target_shape = tuple(dim for dim in input_shape[1:] if dim is not None)
        flat = normalized.flatten()

        try:
            if len(target_shape) == 1 and target_shape[0] == flat.size:
                return flat.reshape((1, *target_shape))
            if int(np.prod(target_shape)) == flat.size:
                return flat.reshape((1, *target_shape))
        except Exception:
            logger.debug("Model input shape %s cannot accept keypoint vector.", input_shape)
        return None

    def _predict_with_frame(self, frame_data: list[Any]) -> GesturePrediction | None:
        if self.model is None:
            return None
        frame = np.asarray(frame_data, dtype=np.float32)
        if frame.size == 0:
            raise ValueError("frame_data cannot be empty.")
        frame = frame / 255.0 if np.max(frame) > 1 else frame

        input_shape = getattr(self.model, "input_shape", None)
        if not input_shape:
            return None
        target_shape = tuple(dim for dim in input_shape[1:] if dim is not None)

        try:
            model_input = frame.reshape((1, *target_shape))
        except ValueError:
            logger.warning("frame_data shape %s does not match model shape %s.", frame.shape, input_shape)
            return None

        probabilities = np.asarray(self.model.predict(model_input, verbose=0))[0]
        class_index = int(np.argmax(probabilities))
        confidence = float(probabilities[class_index])
        group_labels = self.labels.get("model_groups", [])
        word = group_labels[class_index] if class_index < len(group_labels) else "UNKNOWN"
        return GesturePrediction(word=word, confidence=round(confidence, 4), source="keras_frame")

    def _predict_with_keypoint_fallback(self, normalized: np.ndarray) -> GesturePrediction:
        extended = self._finger_extension_signature(normalized)
        known = self.labels.get("fallback_signatures", {})
        signature = "".join("1" if value else "0" for value in extended)
        word = known.get(signature)

        if word is None:
            words = self.labels.get("fallback_words", ["UNKNOWN"])
            # Stable deterministic fallback for demos without a model.
            bucket = int(abs(float(np.sum(normalized) * 1000))) % len(words)
            word = words[bucket]
            confidence = 0.55
        else:
            confidence = 0.72

        return GesturePrediction(word=word, confidence=confidence, source="keypoint_fallback")

    def _finger_extension_signature(self, normalized: np.ndarray) -> list[bool]:
        if normalized.shape[0] < 21:
            return [False, False, False, False, False]

        thumb_open = normalized[4, 0] > normalized[3, 0]
        index_open = normalized[8, 1] < normalized[6, 1]
        middle_open = normalized[12, 1] < normalized[10, 1]
        ring_open = normalized[16, 1] < normalized[14, 1]
        pinky_open = normalized[20, 1] < normalized[18, 1]
        return [thumb_open, index_open, middle_open, ring_open, pinky_open]

    def _disambiguate_group(self, group: str, normalized: np.ndarray) -> str:
        group_map = self.labels.get("group_representatives", {})
        candidates = group_map.get(group, [group])
        if len(candidates) == 1:
            return candidates[0]

        extended_count = sum(self._finger_extension_signature(normalized))
        index = min(extended_count, len(candidates) - 1)
        return candidates[index]


predictor = GesturePredictor()


def predict_gesture(
    keypoints: list[list[float]] | None = None,
    frame_data: list[Any] | None = None,
) -> tuple[str, float]:
    prediction = predictor.predict_gesture(keypoints=keypoints, frame_data=frame_data)
    return prediction.word, prediction.confidence
