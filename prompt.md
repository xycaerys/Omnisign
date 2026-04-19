You are a senior backend engineer building a modular AI system.

Build a production-ready FastAPI backend for a **bidirectional sign language communication system**.

The backend must integrate logic from this repository:
https://github.com/Devansh-47/Sign-Language-To-Text-and-Speech-Conversion.git

Reuse its gesture recognition and prediction logic, but refactor it into a clean API-based architecture.

---

# 🎯 SYSTEM REQUIREMENTS

The backend must support **BIDIRECTIONAL FLOW**:

### 1. Sign → Text (Gesture Recognition)

* Input: hand keypoints OR frame data
* Output: predicted word + confidence
* Apply smoothing to stabilize predictions

---

### 2. Text → Sign (Avatar Output)

* Input: text sentence
* Output:

  * tokenized sign words
  * animation JSON (for avatar system)
  * facial expression flags

---

# ⚙️ TECH STACK

* FastAPI
* Python 3.10+
* NumPy
* TensorFlow/Keras (for loading model if needed)
* Pydantic for request validation

---

# 📁 PROJECT STRUCTURE (STRICT)

backend/
│
├── app.py
│
├── routes/
│   ├── sign_to_text.py
│   ├── text_to_sign.py
│
├── core/
│   ├── model_loader.py
│   ├── gesture_predictor.py
│   ├── smoothing.py
│   ├── intent_mapper.py
│   ├── syntax_transformer.py
│   ├── animation_mapper.py
│
├── services/
│   ├── pipeline_service.py
│
├── data/
│   ├── gesture_labels.json
│   ├── animation_library.json
│
├── utils/
│   ├── config.py
│
└── requirements.txt

---

# 🔌 API DESIGN

## 1. POST /sign-to-text

### Request:

{
"keypoints": [[x,y,z], ...],
"timestamp": 123456
}

### Response:

{
"word": "HELLO",
"confidence": 0.91,
"smoothed": true,
"intent": "greeting"
}

---

## 2. POST /text-to-sign

### Request:

{
"text": "I need help"
}

### Response:

{
"tokens": ["HELP"],
"animation": [
{
"bone": "right_hand",
"rotation": [0.2, 1.1, 0.4],
"time": 0.1
}
],
"expressions": {
"raised_eyebrows": false,
"headshake": false
}
}

---

# 🧠 CORE LOGIC REQUIREMENTS

## 1. Model Integration

* Extract gesture prediction logic from the provided GitHub repo
* Refactor it into a reusable function:

predict_gesture(keypoints) → (word, confidence)

Do NOT keep it as a script — modularize it

---

## 2. Smoothing Layer (MANDATORY)

Implement sliding window:

* Store last 10 predictions
* Only return output if ≥ 8 are same
* Otherwise return last stable prediction

---

## 3. Intent Mapper

Map words to intent:

Example:
{
"HELP": "emergency",
"DOCTOR": "medical",
"WATER": "request"
}

---

## 4. Syntax Transformer

Convert normal English → sign-friendly tokens:

Rules:

* Remove: is, am, are, the, a
* Convert to uppercase
* Keep only meaningful words

Example:
"I need help" → ["HELP"]

---

## 5. Animation Mapper

Map tokens → animation JSON

Example:
{
"HELP": [
{"bone": "right_hand", "rotation": [0.2,1.1,0.4], "time": 0.1}
]
}

Store mappings in animation_library.json

---

## 6. Expression Engine

Add facial expression flags:

* If text contains "?" → raised_eyebrows = true
* If contains "no/not" → headshake = true

---

## 7. Pipeline Service

Create a service that orchestrates:

Sign → Text flow:
keypoints → predictor → smoothing → intent → response

Text → Sign flow:
text → syntax transform → animation mapping → expressions

---

# ⚡ PERFORMANCE REQUIREMENTS

* Response time < 500ms
* Non-blocking endpoints
* Use async FastAPI where possible

---

# 🧪 TESTING

* Include sample test payloads
* Add basic logging
* Handle errors gracefully

---

# 🔗 INTEGRATION REQUIREMENTS

This backend will be used by:

* React frontend (webcam + UI)
* Three.js avatar system

So:

* Keep responses clean JSON
* Do NOT include UI logic
* Do NOT include rendering logic

---

# 🚫 IMPORTANT CONSTRAINTS

* Do NOT retrain models
* Do NOT add heavy ML pipelines
* Keep it lightweight and hackathon-ready
* Focus on stability over complexity

---

# 🎯 OUTPUT EXPECTATION

Return full working backend code with:

* all files
* imports fixed
* runnable with `uvicorn app:app --reload`

---

# 🧠 FINAL GOAL

This is NOT just a gesture detector.

This is a **real-time communication backend** that:

* understands signs
* interprets intent
* responds in structured format
* supports avatar animation

Design accordingly.
