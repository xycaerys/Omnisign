# 🤟 OmniSign

![OmniSign Banner](https://i.ibb.co/gMbJTBTh/Gemini-Generated-Image-u4b70su4b70su4b7.png)

Real-time bidirectional sign language interpreter. Converts hand gestures to natural language and renders natural language as 3D avatar sign sequences.

---

## ✨ What it does

**✋ Sign → Text** — Captures hand landmarks via webcam, classifies gestures into word tokens, and reconstructs grammatically coherent sentences using an NLP pipeline.

**💬 Text → Sign** — Parses natural language input, extracts intent tokens, and drives a rigged 3D humanoid avatar through a bone-level animation sequence.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| 🎨 Frontend | Next.js, React, Three.js, GLTFLoader |
| ⚙️ Backend | FastAPI (Python) |
| 🧠 NLP | spaCy `en_core_web_sm` |
| 👁️ Computer Vision | MediaPipe, OpenCV |
| 🧍 Avatar | GLB / Mixamo rig, custom JSON animation engine |
| ☁️ Deployment | Vercel (frontend), Render (backend) |

---

## 📁 Project Structure

```
OmniSign/
├── frontend/
│   ├── app/
│   ├── components/
│   ├── public/avatar.glb
│   └── animations/
├── backend/
│   ├── main.py
│   ├── sentence_engine.py
│   └── requirements.txt
└── README.md
```

---

## ⚡ Setup

### 🔹 Backend

```bash
cd backend
pip install -r requirements.txt
python -m spacy download en_core_web_sm
uvicorn main:app --reload
# → http://localhost:8000
```

### 🔹 Frontend

```bash
cd frontend
npm install
npm run dev
# → http://localhost:3000
```

### 🔹 Environment

```
NEXT_PUBLIC_BACKEND_URL=https://your-backend.onrender.com
```

---

## 🔌 API

### `POST /sign-to-text` ✋ → 💬

```json
// Request
{ "words": ["HELP", "DOCTOR", "PAIN"] }

// Response
{ "sentence": "Please help me. I need a doctor. I am in pain." }
```

### `POST /text-to-sign` 💬 → ✋

```json
// Request
{ "text": "I need water" }

// Response
{ "tokens": ["WATER"] }
```

---

## 🎬 Animation Format

Each sign token maps to an animation file composed of bone keyframes:

```json
{
  "bone": "right_hand",
  "rotation": [x, y, z],
  "time": 0.1
}
```

Keyframes are applied as `mixamorig` bone transformations via Three.js at runtime.

---

## 🚀 Deployment Notes

- **🟣 Render (backend):** Free tier has a cold start delay of 30–50 seconds after inactivity.
- **⚫ Vercel (frontend):** Set framework to Next.js. Place all static assets including `avatar.glb` inside `/public`.

---

## 🔮 Roadmap

- Sentence-level sign generation
- 😊 Facial expression and non-manual marker support
- 🌍 ISL and multi-language expansion
- 📱 Mobile deployment
- 🎙️ Real-time voice output

-
