import spacy
from typing import List

try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    # Explicit download handle if required, although external installation handles it
    import spacy.cli
    spacy.cli.download("en_core_web_sm")
    nlp = spacy.load("en_core_web_sm")

PRIORITY = [
    "HELP", "DOCTOR", "PAIN", "BATHROOM", "WATER", "FOOD", "STOP", "MORE", "PLEASE"
]

def preprocess_words(words: List[str]) -> List[str]:
    """Normalize and deduplicate input words, ordering by priority."""
    if not words:
        return []
        
    # Deduplicate while preserving order logic
    unique_words = list(dict.fromkeys(words))
    
    # Sort by priority
    unique_words.sort(key=lambda x: PRIORITY.index(x) if x in PRIORITY else 999)
    
    # Lowercase
    return [w.lower() for w in unique_words]

def nlp_analyze(text: str):
    """Convert text into a spaCy Doc object for linguistic analysis."""
    return nlp(text)

def map_to_semantics(doc, raw_words: List[str]) -> dict:
    """Parse linguistic structures and map tokens into actionable semantics payload."""
    semantics = {
        "intent": "general",
        "needs": [],
        "conditions": [],
        "action": None,
        "is_negative": False,
        "is_polite": False,
        "greeting": False,
        "state": None,
        "yes_no": None,
        "raw_words": raw_words
    }
    
    for token in doc:
        lemma = token.lemma_.lower()
        pos = token.pos_
        
        # Negative handling
        if lemma == "no" or token.dep_ == "neg":
            semantics["is_negative"] = True
            
        # Politeness modifier
        if lemma == "please":
            semantics["is_polite"] = True
            
        # Greeting
        if lemma == "hello":
            semantics["greeting"] = True
            
        # Response Affirmation
        if lemma == "yes":
            semantics["yes_no"] = "yes"
            
        # States
        if lemma in ["good", "thank", "sorry"]:
            semantics["state"] = lemma
            
        # Extract actions (spacy detects verbs generally like 'help', 'stop')
        if pos == "VERB" or lemma in ["help", "stop"]:
            semantics["action"] = lemma
            
        # Extract conditions
        if lemma in ["pain", "bad"]:
            semantics["conditions"].append(lemma)
            
        # Extract nouns for basic needs
        if pos in ["NOUN", "PROPN"] or lemma in ["doctor", "water", "food", "bathroom", "more"]:
            if lemma not in semantics["needs"]:
                semantics["needs"].append(lemma)

    # Intent heuristics evaluation
    if "help" in raw_words and ("doctor" in raw_words or "pain" in raw_words):
        semantics["intent"] = "emergency"
    elif "doctor" in semantics["needs"] or "pain" in semantics["conditions"]:
        semantics["intent"] = "medical"
    elif "water" in semantics["needs"] or "food" in semantics["needs"]:
        semantics["intent"] = "basic_need"
    elif "bathroom" in semantics["needs"]:
        semantics["intent"] = "bathroom"
        
    return semantics

def generate_phrases(semantics: dict) -> List[str]:
    """Generate properly punctuated natural English sentences from semantics."""
    phrases = []
    
    # Greetings & Modifiers
    if semantics["greeting"]:
        phrases.append("Hello.")
    if semantics["yes_no"] == "yes":
        phrases.append("Yes.")
    if semantics["state"] == "thank":
        phrases.append("Thank you.")
    if semantics["state"] == "sorry":
        phrases.append("I am sorry.")
        
    # Actions (Verbs)
    if semantics["action"] == "help":
        if semantics["is_polite"]:
            phrases.append("Please help me.")
        elif semantics["intent"] == "emergency":
            phrases.append("Please help me immediately.")
        else:
            phrases.append("I need help.")
    elif semantics["action"] == "stop":
        if semantics["is_negative"]:
            phrases.append("Do not stop.")
        else:
            phrases.append("Please stop.")
            
    # Needs (Nouns)
    has_more = "more" in semantics["needs"]
    for need in semantics["needs"]:
        if need == "more":
            continue
            
        if need == "doctor":
            if semantics["is_negative"]:
                phrases.append("I do not want a doctor.")
            else:
                phrases.append("I need a doctor.")
                
        elif need in ["water", "food"]:
            prefix = "I do not need " if semantics["is_negative"] else ("Please give me " if semantics["is_polite"] else "I need ")
            postfix = "more " + need if has_more else need
            text = f"{prefix}{postfix}."
            if not any(postfix in p.lower() for p in phrases):
                phrases.append(text)
                
        elif need == "bathroom":
            if semantics["is_negative"]:
                phrases.append("I do not need the bathroom.")
            else:
                phrases.append("I need to go to the bathroom.")
                
    # Conditions
    for cond in semantics["conditions"]:
        if cond == "pain":
            if semantics["is_negative"]:
                phrases.append("I am not in pain.")
            else:
                phrases.append("I am in pain.")
        elif cond == "bad":
             phrases.append("I am not feeling well.")
             
    # States
    if semantics["state"] == "good":
        phrases.append("I am feeling good.")
        
    # Simple isolated cases
    if semantics["is_negative"] and len(semantics["raw_words"]) == 1:
        phrases.append("No.")
    if has_more and len(semantics["needs"]) == 1 and "more" in semantics["needs"]:
        phrases.append("I need more.")
    if semantics["is_polite"] and len(semantics["raw_words"]) == 1:
        phrases.append("Please.")

    return phrases

def build_final_sentence(phrases: List[str]) -> str:
    """Concatenate and format final output string."""
    final = " ".join(phrases)
    return final.strip()

def generate_sentence(words: List[str]) -> str:
    """Main production function for generating sentence from raw sign tokens."""
    if not words:
        return ""
        
    processed_words = preprocess_words(words)
    doc = nlp_analyze(" ".join(processed_words))
    semantics = map_to_semantics(doc, processed_words)
    phrases = generate_phrases(semantics)
    return build_final_sentence(phrases)

if __name__ == "__main__":
    tests = [
        ["HELP", "DOCTOR", "PAIN"],
        ["WATER"],
        ["NO", "WATER"],
        ["PLEASE", "WATER"],
        ["NO", "FOOD"],
        ["PLEASE", "HELP"],
        ["BATHROOM"]
    ]
    for t in tests:
        print(f"{t} -> {generate_sentence(t)}")
