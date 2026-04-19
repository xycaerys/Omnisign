from __future__ import annotations


INTENT_MAP = {
    "HELLO": "greeting",
    "HI": "greeting",
    "HELP": "emergency",
    "DOCTOR": "medical",
    "MEDICINE": "medical",
    "PAIN": "medical",
    "WATER": "request",
    "FOOD": "request",
    "EAT": "request",
    "BATHROOM": "request",
    "MORE": "request",
    "YES": "confirmation",
    "NO": "negation",
    "STOP": "negation",
    "THANK": "gratitude",
    "THANKS": "gratitude",
    "SORRY": "apology",
    "GOOD": "feedback",
    "BAD": "feedback",
    "PLEASE": "polite",
}


def map_intent(word: str) -> str:
    return INTENT_MAP.get(word.upper(), "unknown")
