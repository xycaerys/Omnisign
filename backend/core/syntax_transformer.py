from __future__ import annotations

import re


STOP_WORDS = {
    "IS",
    "AM",
    "ARE",
    "THE",
    "A",
    "AN",
    "I",
    "ME",
    "MY",
    "TO",
    "PLEASE",
    "NEED",
    "DO",
    "DOES",
    "DID",
    "HAVE",
    "HAS",
    "HAD",
    "BE",
    "BEEN",
    "CAN",
    "COULD",
    "WOULD",
    "SHOULD",
    "WILL",
    "SHALL",
    "IT",
    "THIS",
    "THAT",
    "FOR",
    "OF",
    "ON",
    "IN",
    "AT",
    "WITH",
    "AND",
    "BUT",
    "OR",
}

SYNONYMS = {
    "NEEDED": "NEED",
    "NEEDS": "NEED",
    "ASSIST": "HELP",
    "ASSISTANCE": "HELP",
    "DRINK": "WATER",
    "THIRSTY": "WATER",
    "HUNGRY": "FOOD",
    "EAT": "FOOD",
    "EATING": "FOOD",
    "PHYSICIAN": "DOCTOR",
    "NURSE": "DOCTOR",
    "MEDIC": "DOCTOR",
    "HURT": "PAIN",
    "HURTS": "PAIN",
    "ACHE": "PAIN",
    "RESTROOM": "BATHROOM",
    "TOILET": "BATHROOM",
    "WASHROOM": "BATHROOM",
    "THANKS": "THANK",
    "APOLOGIZE": "SORRY",
    "APOLOGIES": "SORRY",
    "GREAT": "GOOD",
    "FINE": "GOOD",
    "TERRIBLE": "BAD",
    "AWFUL": "BAD",
    "HALT": "STOP",
    "WAIT": "STOP",
}


def transform_text_to_sign_tokens(text: str) -> list[str]:
    words = re.findall(r"[A-Za-z']+", text.upper())
    tokens: list[str] = []
    for word in words:
        normalized = SYNONYMS.get(word, word)
        if normalized in STOP_WORDS:
            continue
        if normalized not in tokens:
            tokens.append(normalized)
    return tokens
