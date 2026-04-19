from __future__ import annotations

import logging
from typing import Any

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from services.pipeline_service import pipeline_service

logger = logging.getLogger(__name__)
router = APIRouter(tags=["text-to-sign"])


class TextToSignRequest(BaseModel):
    text: str = Field(min_length=1, examples=["I need help"])


class TextToSignResponse(BaseModel):
    tokens: list[str]
    animation: list[dict[str, Any]]
    expressions: dict[str, bool]


@router.post("/text-to-sign", response_model=TextToSignResponse)
async def text_to_sign(payload: TextToSignRequest) -> TextToSignResponse:
    try:
        result = await pipeline_service.text_to_sign(payload.text)
        return TextToSignResponse(**result)
    except Exception as exc:  # pragma: no cover - defensive API boundary
        logger.exception("text-to-sign failed: %s", exc)
        raise HTTPException(status_code=500, detail="Text-to-sign conversion failed.") from exc
