from __future__ import annotations

import logging
from typing import Any

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field, model_validator

from services.pipeline_service import pipeline_service

logger = logging.getLogger(__name__)
router = APIRouter(tags=["sign-to-text"])


class SignToTextRequest(BaseModel):
    keypoints: list[list[float]] | None = Field(
        default=None,
        examples=[[[0.0, 0.0, 0.0], [0.1, 0.2, 0.0], [0.2, 0.3, 0.0]]],
    )
    frame_data: list[Any] | None = Field(default=None, description="Optional model-ready frame array.")
    timestamp: int | float | None = Field(default=None, examples=[123456])

    @model_validator(mode="after")
    def validate_input(self) -> "SignToTextRequest":
        if not self.keypoints and not self.frame_data:
            raise ValueError("Either keypoints or frame_data is required.")
        return self


class SignToTextResponse(BaseModel):
    word: str
    confidence: float
    smoothed: bool
    intent: str


@router.post("/sign-to-text", response_model=SignToTextResponse)
async def sign_to_text(payload: SignToTextRequest) -> SignToTextResponse:
    try:
        result = await pipeline_service.sign_to_text(
            keypoints=payload.keypoints,
            frame_data=payload.frame_data,
        )
        return SignToTextResponse(**result)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    except Exception as exc:  # pragma: no cover - defensive API boundary
        logger.exception("sign-to-text failed: %s", exc)
        raise HTTPException(status_code=500, detail="Gesture prediction failed.") from exc
