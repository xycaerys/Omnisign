from __future__ import annotations

from collections import Counter, deque
from dataclasses import dataclass

from utils.config import settings


@dataclass(frozen=True)
class SmoothedPrediction:
    word: str
    confidence: float
    smoothed: bool


class PredictionSmoother:
    def __init__(
        self,
        window_size: int = settings.smoothing_window_size,
        required_matches: int = settings.smoothing_required_matches,
    ) -> None:
        self.window: deque[tuple[str, float]] = deque(maxlen=window_size)
        self.required_matches = required_matches
        self.last_stable: SmoothedPrediction | None = None

    def update(self, word: str, confidence: float) -> SmoothedPrediction:
        self.window.append((word, confidence))
        counts = Counter(item[0] for item in self.window)
        candidate, matches = counts.most_common(1)[0]

        if matches >= self.required_matches:
            candidate_confidences = [score for label, score in self.window if label == candidate]
            stable = SmoothedPrediction(
                word=candidate,
                confidence=round(sum(candidate_confidences) / len(candidate_confidences), 4),
                smoothed=True,
            )
            self.last_stable = stable
            return stable

        if self.last_stable:
            return self.last_stable

        return SmoothedPrediction(word=word, confidence=confidence, smoothed=False)
