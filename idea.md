# OmniSign Lite — AI-Powered Real-Time Sign Language Assistant

## 🚀 Overview

OmniSign Lite is a real-time assistive communication system designed to bridge the gap between deaf users and non-sign-language users.

Unlike traditional sign detection systems that simply convert gestures into text, OmniSign Lite understands *intent* and generates meaningful responses in real time.

The system is powered by a pre-trained Indian Sign Language detection model (MediaPipe + ANN) and enhanced with an intelligent backend pipeline.

---

## 🧠 Core Idea

Transform sign recognition into a **full conversational system**:

Input:

* User performs a sign via webcam

System:

* Detects gesture
* Converts to word
* Applies context + intent understanding

Output:

* Displays text
* Generates speech
* (Optional) triggers avatar response

---

## 🎯 Problem Statement

Communication barriers for deaf individuals still exist in:

* Hospitals
* ATMs
* Public services
* Customer support
* Video calls

Most existing systems:

* Only detect alphabets
* Lack real-time usability
* Do not handle context or sentences

---

## 💡 Solution

OmniSign Lite introduces:

### 1. Real-Time Gesture Recognition

* Uses MediaPipe + ANN model
* Detects ISL gestures from webcam
* Outputs predicted word with confidence

---

### 2. Temporal Smoothing Engine

* Uses sliding window (10 frames)
* Outputs stable predictions
* Eliminates flickering

---

### 3. Intent Recognition Layer

Maps detected words into meaningful intent:

Examples:

* "HELP" → emergency intent
* "WATER" → request intent
* "DOCTOR" → medical intent

---

### 4. Smart Response Generator

Instead of raw text:

System generates:

* Natural sentence
* Voice output

Example:
Input: "HELP"
Output:

* "This person needs assistance"
* Speech via Web Speech API

---

### 5. Text-to-Sign (Reverse Mode)

User types:

* "How can I help you?"

System:

* Converts to simplified ISL tokens
* Sends animation JSON to avatar

---

## 🏗️ Architecture

### Pipeline:

Webcam → MediaPipe → Keypoints → ANN Model → Prediction
→ Smoothing → Intent Mapping → Response Generator
→ API → Frontend / Avatar

---

### Backend Modules

* mediapipe_handler.py
* gesture_model.py
* smoothing.py
* intent_mapper.py
* response_engine.py
* animation_mapper.py

---

## 🔌 API Design

### /sign-to-text

Input:

* keypoints array

Output:

* word
* confidence
* intent

---

### /text-to-sign

Input:

* text

Output:

* ISL tokens
* animation JSON
* facial expression flags

---

## ⚡ Key Features

* Real-time recognition (<500ms latency)
* Stable predictions (anti-jitter)
* Intent-aware responses
* Speech output (accessibility)
* Bidirectional communication
* Modular backend (scalable)

---

## 🎥 Demo Flow

1. User signs "HELP"
2. System detects gesture
3. Converts to "HELP"
4. Maps to intent: emergency
5. Outputs:

   * Text: "This person needs help"
   * Speech: plays audio
6. Caregiver responds via text
7. Avatar signs back

---

## 🧠 Innovation

This project is not just recognition — it is:

* Context-aware AI system
* Real-time assistive agent
* Scalable communication interface

---

## 📈 Future Scope

* Expand vocabulary (100+ words)
* Support ISL + ASL toggle
* Add LLM-based intent understanding
* Deploy in kiosks (hospital / ATM)
* Mobile app version

---

## 🏆 Why This Wins Hackathon

* Real-world impact (accessibility)
* Working demo (not theoretical)
* Full system (not just ML model)
* Clear scalability

---

## 🔥 Key Insight

We are not building:
"Sign Detection"

We are building:
"Communication Intelligence Layer"
