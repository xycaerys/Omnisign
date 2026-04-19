# OmniSign Lite Frontend

React/Vite website for the bidirectional sign language assistant.

## Run The Full Website

Start the backend first:

```powershell
cd ..\backend
uvicorn app:app --host 127.0.0.1 --port 8000
```

Start the website:

```powershell
cd ..\frontend
npm install
npm run dev -- --host 127.0.0.1 --port 5173
```

Open:

```text
http://127.0.0.1:5173/
```

## What Is Integrated

- The webcam panel opens your camera directly inside the website.
- MediaPipe extracts hand landmarks in the browser.
- The website sends landmarks to `http://127.0.0.1:8000/sign-to-text`.
- Typed text is sent to `http://127.0.0.1:8000/text-to-sign`.
- The avatar now uses the backend `animation` response directly.
- The avatar maps generic backend bones like `right_upper_arm` and `left_hand` to the GLB skeleton names.
- The avatar model is loaded from `public/drive-ybot.glb`, copied from `drive-download-20260419T183729Z-3-001/public/ybot.glb`.

## Avatar Notes

The backend returns frames like:

```json
{
  "bone": "right_upper_arm",
  "rotation": [0.2, 0.0, 0.95],
  "position": [0.2, 0.22, 0.1],
  "time": 0.1
}
```

The website applies rotations to upper arms, forearms, hands, and head. Hand position offsets are applied carefully so the hands move away from the body without stretching the rig too aggressively.

If the avatar does not move, check that the backend is running on port `8000`. If the camera does not start, allow camera permission for `127.0.0.1` in the browser.

If you replace the drive-download model, copy the new file into:

```text
frontend/public/drive-ybot.glb
```

The loader in `src/components/Avatar.jsx` points to that exact file.
