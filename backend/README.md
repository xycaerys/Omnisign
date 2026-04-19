# Bidirectional Sign Language Backend

FastAPI backend for real-time bidirectional sign language communication:

- Sign to text: hand keypoints or frame data -> predicted word -> smoothed result -> intent
- Text to sign: English sentence -> sign tokens -> avatar animation JSON -> facial expression flags

## 1. Setup

Use Python 3.10 or newer.

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

For quick webcam testing, `requirements.txt` is enough. The backend can run the keypoint fallback logic without TensorFlow.

Install TensorFlow only when you are ready to load the upstream Keras model:

```powershell
pip install -r requirements-ml.txt
```

Production gesture prediction should use the upstream model file.

## 2. Add The Gesture Model

The referenced repository uses a Keras model named:

```text
cnn8grps_rad1_model.h5
```

Place it here:

```text
backend/cnn8grps_rad1_model.h5
```

Or point to it with an environment variable:

```powershell
$env:SIGN_MODEL_PATH="C:\path\to\cnn8grps_rad1_model.h5"
```

If the file is missing, the API stays online and uses a deterministic keypoint fallback so the frontend and avatar integration can continue during hackathon development.

## 3. Run The API

From the `backend` directory:

```powershell
uvicorn app:app --reload
```

Open the interactive API docs:

```text
http://127.0.0.1:8000/docs
```

Open the webcam tester:

```text
http://127.0.0.1:8000/webcam-test
```

The webcam tester runs in your browser, asks for camera permission, detects one hand with MediaPipe, and sends hand landmarks to `POST /sign-to-text`.

Health check:

```text
GET http://127.0.0.1:8000/health
```

Expected response:

```json
{
  "status": "ok",
  "service": "Bidirectional Sign Language API"
}
```

## 4. Sign To Text

Endpoint:

```text
POST /sign-to-text
```

Use this when your React webcam or MediaPipe layer has extracted hand landmarks.

Request:

```json
{
  "keypoints": [
    [0.0, 0.0, 0.0],
    [0.1, 0.2, 0.0],
    [0.2, 0.3, 0.0],
    [0.3, 0.4, 0.0],
    [0.4, 0.5, 0.0]
  ],
  "timestamp": 123456
}
```

Response:

```json
{
  "word": "HELLO",
  "confidence": 0.72,
  "smoothed": false,
  "intent": "greeting"
}
```

Example curl:

```powershell
curl -X POST "http://127.0.0.1:8000/sign-to-text" `
  -H "Content-Type: application/json" `
  -d "{\"keypoints\":[[0,0,0],[0.1,0.1,0],[0.2,0.2,0],[0.3,0.3,0],[0.4,0.4,0]],\"timestamp\":123456}"
```

### Smoothing Behavior

The smoothing layer stores the last 10 predictions.

- If 8 or more predictions match, that word becomes stable.
- If the current window is unstable, the API returns the last stable prediction.
- If there is no stable prediction yet, it returns the current raw prediction with `"smoothed": false`.

For real-time use, call `/sign-to-text` continuously as frames arrive from the webcam.

## 5. Webcam Test Page

The backend includes a simple local test page:

```text
http://127.0.0.1:8000/webcam-test
```

Use it like this:

1. Start the API with `uvicorn app:app --reload`.
2. Open `http://127.0.0.1:8000/webcam-test` in Chrome or Edge.
3. Click `Start Camera`.
4. Allow camera access when the browser asks.
5. Hold one hand clearly in view.
6. Watch the predicted word, confidence, smoothing state, and intent update on the right.

The page uses MediaPipe in the browser to extract 21 hand landmarks. Those landmarks are sent to the backend as:

```json
{
  "keypoints": [
    [0.42, 0.71, -0.01],
    [0.39, 0.65, -0.02]
  ],
  "timestamp": 123456789
}
```

Important notes:

- Webcam access works on `localhost` / `127.0.0.1`.
- The first load needs internet access because the test page loads MediaPipe from a CDN.
- If the upstream `.h5` model is missing, the backend still returns fallback predictions so the webcam pipeline can be tested end to end.
- For stable results, keep your hand centered and send several frames so the smoothing window can lock onto a prediction.

## 6. Text To Sign

Endpoint:

```text
POST /text-to-sign
```

Use this when a speaking/hearing user types text and the Three.js avatar needs structured animation data.

Request:

```json
{
  "text": "I need help"
}
```

Response:

```json
{
  "tokens": ["HELP"],
  "animation": [
    {
      "bone": "left_upper_arm",
      "rotation": [0.15, 0.0, -0.85],
      "position": [-0.18, 0.18, 0.08],
      "time": 0.0
    },
    {
      "bone": "right_hand",
      "rotation": [0.15, 0.4, 0.2],
      "position": [0.26, 0.0, 0.42],
      "time": 0.1
    }
  ],
  "expressions": {
    "raised_eyebrows": false,
    "headshake": false
  }
}
```

Example curl:

```powershell
curl -X POST "http://127.0.0.1:8000/text-to-sign" `
  -H "Content-Type: application/json" `
  -d "{\"text\":\"I need help\"}"
```

## 7. Expression Rules

The expression engine is intentionally simple and fast:

- Text containing `?` sets `"raised_eyebrows": true`
- Text containing `no`, `not`, or `never` sets `"headshake": true`

Example:

```json
{
  "text": "Do you not need water?"
}
```

Produces expression flags:

```json
{
  "raised_eyebrows": true,
  "headshake": true
}
```

## 8. Customize Gesture Labels

Edit:

```text
data/gesture_labels.json
```

Use this file to adjust:

- Model group names
- Representative labels for upstream 8-group predictions
- Fallback keypoint signatures
- Demo fallback words

## 9. Customize Avatar Animations

Edit:

```text
data/animation_library.json
```

Each token maps to a list of animation keyframes:

```json
{
  "HELP": [
    {
      "bone": "right_upper_arm",
      "rotation": [0.2, 0.0, 0.95],
      "position": [0.2, 0.22, 0.1],
      "time": 0.1
    },
    {
      "bone": "right_hand",
      "rotation": [0.15, 0.4, 0.2],
      "position": [0.26, 0.0, 0.42],
      "time": 0.1
    }
  ]
}
```

The Three.js avatar can read each frame as:

- `bone`: avatar skeleton bone name
- `rotation`: Euler rotation values
- `position`: optional local position offset to move hands away from the torso
- `time`: animation timestamp in seconds

The animation library now drives these generic bone names:

- `left_upper_arm`
- `left_forearm`
- `left_hand`
- `right_upper_arm`
- `right_forearm`
- `right_hand`
- `head`

If your GLTF avatar uses names like `mixamorigRightArm`, `RightForeArm`, or `RightHand`, create a frontend bone-name map from these generic names to the real skeleton names. To make the signs visible, apply both rotation and position when a frame includes both:

```js
const boneMap = {
  right_upper_arm: "mixamorigRightArm",
  right_forearm: "mixamorigRightForeArm",
  right_hand: "mixamorigRightHand",
  left_upper_arm: "mixamorigLeftArm",
  left_forearm: "mixamorigLeftForeArm",
  left_hand: "mixamorigLeftHand",
  head: "mixamorigHead"
};

function applyFrame(frame, skeleton) {
  const boneName = boneMap[frame.bone] || frame.bone;
  const bone = skeleton.getBoneByName(boneName);
  if (!bone) return;

  if (frame.rotation) {
    bone.rotation.set(frame.rotation[0], frame.rotation[1], frame.rotation[2]);
  }

  if (frame.position) {
    bone.position.set(frame.position[0], frame.position[1], frame.position[2]);
  }
}
```

If your rig looks distorted after applying `position`, keep position only for hand bones and use rotation for arms. Different avatar rigs have different local bone axes, so the bone map is the first thing to check when hands do not raise correctly.

## 10. React Integration Pattern

Recommended frontend flow:

1. Capture webcam frames in React.
2. Extract hand landmarks with MediaPipe Hands or a similar library.
3. Send normalized landmarks to `POST /sign-to-text`.
4. Display the returned `word`, `confidence`, and `intent`.
5. Send typed text to `POST /text-to-sign`.
6. Feed returned `animation` and `expressions` into the Three.js avatar.

Keep UI rendering in React and Three.js. This backend only returns clean JSON.

## 11. Troubleshooting

If `uvicorn` is not found:

```powershell
pip install -r requirements.txt
```

If TensorFlow is not installed, the API will still start. It logs a warning and uses the keypoint fallback until you install `requirements-ml.txt` and add the model file.

If TensorFlow fails to install, check your Python version first. Python 3.10 or 3.11 is usually the safest choice.

If the API logs say the model was not found, place `cnn8grps_rad1_model.h5` in `backend/` or set `SIGN_MODEL_PATH`.

If `/sign-to-text` returns unstable predictions at first, that is expected. Send several consecutive frames so the 10-frame smoothing window can stabilize.

If `/webcam-test` opens but the camera does not start, check browser permissions for `127.0.0.1`, close other apps using the webcam, and reload the page.

If `/webcam-test` says MediaPipe failed to load, check your internet connection or CDN access. The backend API can still run, but that page needs MediaPipe to extract hand landmarks from the video.
