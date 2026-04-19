# OmniSign Website

This is the active Next.js frontend for the OmniSign bidirectional sign language demo.

## Backend Integration

The website talks to the FastAPI backend through local `/api/*` routes. `next.config.ts` rewrites:

```text
/api/:path* -> http://localhost:8000/:path*
```

That means the frontend calls:

- `/api/sign-to-text`
- `/api/text-to-sign`
- `/api/format-sentence`

and Next.js forwards them to the backend.

## Run Everything

Start the backend:

```powershell
cd ..\backend
uvicorn app:app --host 127.0.0.1 --port 8000
```

Start the website:

```powershell
cd ..\website
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

## What Works

- Webcam sign recognition runs inside the website.
- MediaPipe extracts hand landmarks in the browser.
- Landmarks are sent to the backend `/sign-to-text` endpoint.
- Stable signs are buffered into a raw sign sentence.
- Raw signs can be formatted by `/format-sentence`.
- Typed English text is sent to `/text-to-sign`.
- The 3D avatar uses the backend `animation` array directly.
- The avatar supports upper arms, forearms, hands, head, and hand position offsets.

## Avatar Model

The avatar model is:

```text
public/ybot.glb
```

The avatar component is:

```text
src/components/SignAvatar.tsx
```

The backend returns frames like:

```json
{
  "bone": "right_upper_arm",
  "rotation": [0.2, 0.0, 0.95],
  "position": [0.2, 0.22, 0.1],
  "time": 0.1
}
```

`SignAvatar.tsx` maps those backend bone names to the GLB skeleton:

```text
right_upper_arm -> mixamorigRightArm
right_forearm   -> mixamorigRightForeArm
right_hand      -> mixamorigRightHand
left_upper_arm  -> mixamorigLeftArm
left_forearm    -> mixamorigLeftForeArm
left_hand       -> mixamorigLeftHand
head            -> mixamorigHead
```

## Troubleshooting

If sign recognition or translation fails, check the backend:

```text
http://127.0.0.1:8000/health
```

If the avatar does not move, type a phrase like:

```text
I need help
```

and check the browser console for GLB or animation errors.

If the camera does not start, allow camera permission for `localhost` in your browser.
