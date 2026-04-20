from __future__ import annotations

import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from routes.sign_to_text import router as sign_to_text_router
from routes.text_to_sign import router as text_to_sign_router
from utils.config import BASE_DIR, settings


logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s [%(name)s] %(message)s",
)

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="API backend for bidirectional sign language communication.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(sign_to_text_router)
app.include_router(text_to_sign_router)
app.mount("/static", StaticFiles(directory=BASE_DIR / "static"), name="static")


@app.get("/", tags=["root"])
async def root() -> dict[str, str]:
    return {"message": "OmniSign API is live and healthy!", "docs": "/docs"}


@app.get("/health", tags=["health"])
async def health() -> dict[str, str]:
    return {"status": "ok", "service": settings.app_name}


@app.get("/webcam-test", tags=["test-tools"])
async def webcam_test() -> FileResponse:
    return FileResponse(BASE_DIR / "static" / "webcam_test.html")


from pydantic import BaseModel
from typing import List
from core.sentence_engine import generate_sentence

class SentenceRequest(BaseModel):
    words: List[str]

@app.post("/format-sentence", tags=["intent-engine"])
async def format_sentence(req: SentenceRequest):
    result = generate_sentence(req.words)
    return {"sentence": result}
