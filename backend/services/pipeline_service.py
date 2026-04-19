from __future__ import annotations

import asyncio
import logging
from typing import Any

from core.animation_mapper import AnimationMapper, expression_flags
from core.gesture_predictor import predictor
from core.intent_mapper import map_intent
from core.smoothing import PredictionSmoother
from core.syntax_transformer import transform_text_to_sign_tokens

logger = logging.getLogger(__name__)


class PipelineService:
    def __init__(self) -> None:
        self.smoother = PredictionSmoother()
        self.animation_mapper = AnimationMapper()

    async def sign_to_text(
        self,
        keypoints: list[list[float]] | None,
        frame_data: list[Any] | None,
    ) -> dict[str, Any]:
        prediction = await asyncio.to_thread(
            predictor.predict_gesture,
            keypoints=keypoints,
            frame_data=frame_data,
        )
        smoothed = self.smoother.update(prediction.word, prediction.confidence)
        intent = map_intent(smoothed.word)

        logger.info(
            "sign_to_text raw=%s stable=%s confidence=%.3f intent=%s",
            prediction.word,
            smoothed.word,
            smoothed.confidence,
            intent,
        )
        return {
            "word": smoothed.word,
            "confidence": smoothed.confidence,
            "smoothed": smoothed.smoothed,
            "intent": intent,
        }

    async def text_to_sign(self, text: str) -> dict[str, Any]:
        tokens = transform_text_to_sign_tokens(text)
        animation = self.animation_mapper.map_tokens(tokens)
        expressions = expression_flags(text)

        logger.info("text_to_sign tokens=%s animation_frames=%d", tokens, len(animation))
        return {
            "tokens": tokens,
            "animation": animation,
            "expressions": expressions,
        }


pipeline_service = PipelineService()
