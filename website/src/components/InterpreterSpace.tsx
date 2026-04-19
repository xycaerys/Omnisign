'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { MouseEvent } from 'react';
import {
  Camera,
  Hand,
  Mic,
  MonitorSmartphone,
  ScanEye,
  Send,
  Sparkles,
  Square,
  Type,
  Activity,
  Volume2,
} from 'lucide-react';

/* Load SignAvatar dynamically to avoid SSR issues with Three.js */
const SignAvatar = dynamic(() => import('./SignAvatar'), { ssr: false });

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface SignToTextResult {
  word: string;
  confidence: number;
  smoothed: boolean;
  intent: string;
}

interface TextToSignResult {
  tokens: string[];
  animation: Array<{ bone: string; rotation: number[]; position?: number[]; time: number }>;
  expressions: { raised_eyebrows: boolean; headshake: boolean };
}

interface LogEntry {
  id: number;
  time: string;
  direction: 'sign→text' | 'text→sign' | 'sentence' | 'system';
  message: string;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const API_BASE = '/api';
const PREDICT_INTERVAL_MS = 120; // ~8fps matching the original WebcamCapture
const HAND_CONNECTIONS: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [0, 5], [5, 6], [6, 7], [7, 8],
  [0, 9], [9, 10], [10, 11], [11, 12],
  [0, 13], [13, 14], [14, 15], [15, 16],
  [0, 17], [17, 18], [18, 19], [19, 20],
  [5, 9], [9, 13], [13, 17],
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function InterpreterSpace() {
  /* ---- Sign → Text state ---- */
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const handLandmarkerRef = useRef<any>(null);
  const animFrameRef = useRef<number>(0);
  const lastPredictRef = useRef<number>(0);
  const lastSmoothedWordRef = useRef<string>('');
  const isStartingCameraRef = useRef(false);

  const [cameraOn, setCameraOn] = useState(false);
  const [currentWord, setCurrentWord] = useState<string | null>(null);
  const [confidence, setConfidence] = useState(0);
  const [intent, setIntent] = useState<string | null>(null);
  const [isSmoothed, setIsSmoothed] = useState(false);
  const [rawSigns, setRawSigns] = useState('');
  const [sentence, setSentence] = useState<string | null>(null);
  const [isCameraLoading, setIsCameraLoading] = useState(false);

  /* ---- Text → Sign state ---- */
  const [textInput, setTextInput] = useState('');
  const [avatarData, setAvatarData] = useState<TextToSignResult | null>(null);
  const [signTokens, setSignTokens] = useState<string[]>([]);
  const [expressions, setExpressions] = useState<TextToSignResult['expressions'] | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);

  /* ---- Activity log ---- */
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const logIdRef = useRef(0);
  const logContainerRef = useRef<HTMLDivElement>(null);

  const addLog = useCallback(
    (direction: LogEntry['direction'], message: string) => {
      const entry: LogEntry = {
        id: logIdRef.current++,
        time: new Date().toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
        direction,
        message,
      };
      setLogs((prev) => [...prev.slice(-49), entry]);
    },
    [],
  );

  // Auto-scroll log
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  /* ---------------------------------------------------------------- */
  /*  Sign → Text: camera + MediaPipe                                  */
  /* ---------------------------------------------------------------- */

  const sendKeypoints = useCallback(
    async (keypoints: number[][]) => {
      try {
        const res = await fetch(`${API_BASE}/sign-to-text`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ keypoints, timestamp: Date.now() }),
        });
        if (!res.ok) return;
        const data: SignToTextResult = await res.json();

        // Always show the current detected word (like original WebcamCapture)
        setCurrentWord(data.word);
        setConfidence(data.confidence);
        setIntent(data.intent);
        setIsSmoothed(data.smoothed);

        // Build raw signs sentence when a word stabilizes
        if (data.smoothed && data.word !== 'UNKNOWN' && data.word !== lastSmoothedWordRef.current) {
          const separator = data.word.length === 1 && lastSmoothedWordRef.current.length === 1 ? '' : ' ';
          setRawSigns((prev) => (prev ? prev + separator + data.word : data.word));
          lastSmoothedWordRef.current = data.word;
          addLog('sign→text', `Stable: ${data.word} (${(data.confidence * 100).toFixed(0)}% — ${data.intent})`);
        }
      } catch {
        /* network error — ignore silently */
      }
    },
    [addLog],
  );

  const drawHandLandmarks = useCallback((landmarks: Array<{ x: number; y: number; z?: number }>) => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = video.videoWidth || canvas.clientWidth || 640;
    const height = video.videoHeight || canvas.clientHeight || 480;
    canvas.width = width;
    canvas.height = height;

    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = '#a855f7';
    ctx.fillStyle = '#c4b5fd';
    ctx.lineWidth = 3;

    HAND_CONNECTIONS.forEach(([start, end]) => {
      const a = landmarks[start];
      const b = landmarks[end];
      if (!a || !b) return;

      ctx.beginPath();
      ctx.moveTo(a.x * width, a.y * height);
      ctx.lineTo(b.x * width, b.y * height);
      ctx.stroke();
    });

    landmarks.forEach((point) => {
      ctx.beginPath();
      ctx.arc(point.x * width, point.y * height, 4, 0, Math.PI * 2);
      ctx.fill();
    });
  }, []);

  const startCamera = useCallback(async (event?: MouseEvent<HTMLButtonElement>) => {
    event?.preventDefault();
    event?.stopPropagation();

    if (cameraOn || isStartingCameraRef.current) {
      return;
    }

    isStartingCameraRef.current = true;
    setIsCameraLoading(true);
    addLog('system', 'Starting camera & loading hand detection…');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 640, height: 480 },
        audio: false,
      });
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await new Promise<void>((resolve) => {
          if (!videoRef.current || videoRef.current.readyState >= 1) {
            resolve();
            return;
          }
          videoRef.current.onloadedmetadata = () => resolve();
        });
        await videoRef.current.play();
      }

      const { FilesetResolver, HandLandmarker } = await import('@mediapipe/tasks-vision');
      const vision = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.34/wasm',
      );
      const handLandmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
          delegate: 'GPU',
        },
        runningMode: 'VIDEO',
        numHands: 1,
      });
      handLandmarkerRef.current = handLandmarker;

      // Frame loop
      const processFrame = async () => {
        try {
          const video = videoRef.current;
          const canvas = canvasRef.current;
          const landmarker = handLandmarkerRef.current;

          if (video && canvas && video.readyState >= 2 && landmarker) {
            const result = landmarker.detectForVideo(video, performance.now());
            const landmarks = result.landmarks?.[0];

            if (landmarks) {
              drawHandLandmarks(landmarks);

              const now = Date.now();
              if (now - lastPredictRef.current >= PREDICT_INTERVAL_MS) {
                lastPredictRef.current = now;
                const keypoints = landmarks.map((point: { x: number; y: number; z?: number }) => [
                  Number(point.x.toFixed(5)),
                  Number(point.y.toFixed(5)),
                  Number((point.z || 0).toFixed(5)),
                ]);
                sendKeypoints(keypoints);
              }
            } else {
              const ctx = canvas.getContext('2d');
              ctx?.clearRect(0, 0, canvas.width, canvas.height);
            }
          }
        } catch (err) {
          addLog('system', `Hand tracking frame skipped: ${err instanceof Error ? err.message : 'unknown error'}`);
        }
        animFrameRef.current = requestAnimationFrame(processFrame);
      };
      animFrameRef.current = requestAnimationFrame(processFrame);

      setCameraOn(true);
      setIsCameraLoading(false);
      isStartingCameraRef.current = false;
      addLog('system', 'Camera active — sign recognition is running');
    } catch (err) {
      setIsCameraLoading(false);
      isStartingCameraRef.current = false;
      addLog('system', `Camera error: ${err instanceof Error ? err.message : 'unknown'}`);
    }
  }, [addLog, cameraOn, drawHandLandmarks, sendKeypoints]);

  const stopCamera = useCallback((event?: MouseEvent<HTMLButtonElement>) => {
    event?.preventDefault();
    event?.stopPropagation();
    isStartingCameraRef.current = false;

    cancelAnimationFrame(animFrameRef.current);
    if (handLandmarkerRef.current) {
      handLandmarkerRef.current.close();
      handLandmarkerRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraOn(false);
    setCurrentWord(null);
    setConfidence(0);
    setIntent(null);
    setIsSmoothed(false);
    addLog('system', 'Camera stopped');
  }, [addLog]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancelAnimationFrame(animFrameRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (handLandmarkerRef.current) {
        handLandmarkerRef.current.close();
      }
    };
  }, []);

  /* ---- Sentence Formation (NLP) ---- */
  const formSentence = useCallback(async (event?: MouseEvent<HTMLButtonElement>) => {
    event?.preventDefault();
    event?.stopPropagation();

    if (!rawSigns) return;
    const words = rawSigns.trim().toUpperCase().split(/\s+/).filter((w: string) => w !== '');
    if (words.length === 0) return;
    addLog('sentence', `Forming sentence from: [${words.join(', ')}]`);
    try {
      const res = await fetch(`${API_BASE}/format-sentence`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ words }),
      });
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setSentence(data.sentence);
      addLog('sentence', `→ "${data.sentence}"`);
    } catch {
      addLog('sentence', 'Sentence formation failed');
    }
  }, [rawSigns, addLog]);

  const handleSpeak = useCallback((event?: MouseEvent<HTMLButtonElement>) => {
    event?.preventDefault();
    event?.stopPropagation();

    const text = sentence || rawSigns;
    if (text) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  }, [sentence, rawSigns]);

  const clearBuffer = useCallback((event?: MouseEvent<HTMLButtonElement>) => {
    event?.preventDefault();
    event?.stopPropagation();

    setRawSigns('');
    setSentence(null);
    setCurrentWord(null);
    setConfidence(0);
    setIntent(null);
    setIsSmoothed(false);
    lastSmoothedWordRef.current = '';
  }, []);

  /* ---------------------------------------------------------------- */
  /*  Text → Sign                                                      */
  /* ---------------------------------------------------------------- */

  const translateToSign = useCallback(async (event?: MouseEvent<HTMLButtonElement>) => {
    event?.preventDefault();
    event?.stopPropagation();

    if (!textInput.trim()) return;
    setIsTranslating(true);
    addLog('text→sign', `Translating: "${textInput}"`);
    try {
      const res = await fetch(`${API_BASE}/text-to-sign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textInput }),
      });
      if (!res.ok) throw new Error('Failed');
      const data: TextToSignResult = await res.json();
      setSignTokens(data.tokens);
      setExpressions(data.expressions);
      setAvatarData(data); // Pass to avatar for animation
      addLog('text→sign', `Tokens: [${data.tokens.join(', ')}] — ${data.animation.length} frames → Avatar animating`);
    } catch {
      addLog('text→sign', 'Translation failed — is the backend running?');
    } finally {
      setIsTranslating(false);
    }
  }, [textInput, addLog]);

  /* ---------------------------------------------------------------- */
  /*  Render                                                           */
  /* ---------------------------------------------------------------- */

  const directionColors: Record<LogEntry['direction'], string> = {
    'sign→text': 'text-purple-400',
    'text→sign': 'text-indigo-400',
    sentence: 'text-amber-400',
    system: 'text-white/40',
  };

  return (
    <section id="interpreter" className="border-t border-white/6 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <p className="text-sm uppercase tracking-[0.32em] text-white/42">
            Interpreter Space
          </p>
          <h2 className="mt-5 font-headline text-4xl font-medium tracking-[-0.03em] text-white md:text-6xl">
            Live bidirectional sign language interpreter.
          </h2>
          <p className="mt-6 text-lg leading-8 text-white/64">
            Use your webcam for sign-to-text recognition, or type text to
            translate into sign language with a 3D avatar.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* ============ LEFT: Sign → Text ============ */}
          <div className="rounded-[36px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-6 backdrop-blur-xl md:p-8">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3 text-white/80">
                <ScanEye size={18} />
                <span className="text-sm uppercase tracking-[0.24em]">
                  Sign → Text
                </span>
              </div>
              {!cameraOn ? (
                <button
                  type="button"
                  onClick={startCamera}
                  disabled={isCameraLoading}
                  className="flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-xs font-medium text-purple-300 transition hover:bg-purple-500/20 disabled:opacity-50"
                >
                  <Camera size={14} />
                  {isCameraLoading ? 'Loading…' : 'Start Camera'}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={stopCamera}
                  className="flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs font-medium text-red-300 transition hover:bg-red-500/20"
                >
                  <Square size={14} />
                  Stop Camera
                </button>
              )}
            </div>

            {/* Camera Feed */}
            <div className="relative overflow-hidden rounded-[22px] border border-white/8 bg-black/40">
              <div className="relative aspect-[4/3]">
                <video
                  ref={videoRef}
                  className="absolute inset-0 h-full w-full object-cover"
                  style={{ transform: 'scaleX(-1)' }}
                  muted
                  playsInline
                />
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 h-full w-full"
                  style={{ transform: 'scaleX(-1)' }}
                />
                {!cameraOn && !isCameraLoading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.12),rgba(255,255,255,0.02))]">
                    <Camera size={32} className="text-white/30" />
                    <p className="text-sm text-white/40">
                      Click &quot;Start Camera&quot; to begin
                    </p>
                  </div>
                )}
                {isCameraLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                    <div className="flex items-center gap-3 text-white/60">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-purple-500/30 border-t-purple-500" />
                      <span className="text-sm">Loading hand detection…</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Live Recognition */}
            <div className="mt-4 rounded-[20px] border border-white/8 bg-black/20 p-4">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/40">
                <Activity size={12} />
                Live Recognition
              </div>
              <div className="mt-3 flex items-center gap-4">
                <div className="flex-1">
                  <p className={`text-2xl font-semibold ${isSmoothed ? 'text-white' : 'text-white/50'}`}>
                    {currentWord || '—'}
                  </p>
                  <div className="mt-1 flex gap-2">
                    {intent && intent !== 'unknown' && (
                      <span className="inline-block rounded-full bg-purple-500/15 px-2.5 py-0.5 text-xs font-medium text-purple-300">
                        {intent}
                      </span>
                    )}
                    {currentWord && !isSmoothed && (
                      <span className="inline-block rounded-full bg-amber-500/15 px-2.5 py-0.5 text-xs font-medium text-amber-300">
                        Stabilizing…
                      </span>
                    )}
                    {currentWord && isSmoothed && (
                      <span className="inline-block rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-medium text-emerald-300">
                        Stable
                      </span>
                    )}
                  </div>
                </div>
                {/* Confidence bar */}
                <div className="w-24">
                  <div className="flex items-center justify-between text-xs text-white/50">
                    <span>Conf.</span>
                    <span>{(confidence * 100).toFixed(0)}%</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-300"
                      style={{ width: `${confidence * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Transcription & Sentence */}
            <div className="mt-4 rounded-[20px] border border-white/8 bg-black/20 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/40">
                  <Type size={12} />
                  Transcription
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={clearBuffer}
                    className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/50 transition hover:bg-white/5"
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={formSentence}
                    disabled={!rawSigns}
                    className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-300 transition hover:bg-amber-500/20 disabled:opacity-40"
                  >
                    Form Sentence
                  </button>
                  <button
                    type="button"
                    onClick={handleSpeak}
                    disabled={!sentence && !rawSigns}
                    className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300 transition hover:bg-emerald-500/20 disabled:opacity-40"
                  >
                    🔊 Speak
                  </button>
                </div>
              </div>

              {/* Raw Signs */}
              <div className="mt-3">
                <p className="text-xs text-white/40">Raw Signs:</p>
                <p className="mt-1 text-base font-medium uppercase tracking-wider text-white/70">
                  {rawSigns || '—'}
                </p>
              </div>

              {/* Formed Sentence */}
              {sentence && (
                <div className="mt-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3">
                  <p className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-amber-400/60">
                    <Volume2 size={12} />
                    Formed Sentence
                  </p>
                  <p className="mt-2 text-lg font-semibold text-white/90">
                    &ldquo;{sentence}&rdquo;
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ============ RIGHT: Text → Sign + Avatar ============ */}
          <div className="rounded-[36px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl md:p-8">
            <div className="mb-5 flex items-center gap-3 text-white/80">
              <MonitorSmartphone size={18} />
              <span className="text-sm uppercase tracking-[0.24em]">
                Text → Sign Avatar
              </span>
            </div>

            {/* 3D Avatar */}
            <div className="overflow-hidden rounded-[22px] border border-white/8 bg-[#0c0a1a]" style={{ height: '360px' }}>
              <SignAvatar avatarData={avatarData} />
            </div>

            {/* Text Input */}
            <div className="mt-4 rounded-[22px] border border-white/8 bg-black/20 p-5">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/40">
                <Mic size={12} />
                Caregiver Input
              </div>
              <div className="mt-3 flex gap-2">
                <input
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Type a message to the Avatar (e.g. 'I need help?')"
                  className="flex-1 rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white/90 placeholder-white/30 outline-none transition focus:border-indigo-500/40 focus:bg-white/[0.05]"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      translateToSign();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={translateToSign}
                  disabled={!textInput.trim() || isTranslating}
                  className="flex items-center gap-2 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-4 py-3 text-sm font-medium text-indigo-300 transition hover:bg-indigo-500/20 disabled:opacity-40"
                >
                  <Send size={14} />
                </button>
              </div>
            </div>

            {/* Sign Tokens */}
            {signTokens.length > 0 && (
              <div className="mt-4 rounded-[20px] border border-white/8 bg-black/20 p-4">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/40">
                  <Hand size={12} />
                  Sign Tokens
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {signTokens.map((token, i) => (
                    <span
                      key={`${token}-${i}`}
                      className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1.5 text-sm font-medium text-indigo-300"
                    >
                      {token}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Expression Flags */}
            {expressions && (
              <div className="mt-4 rounded-[20px] border border-white/8 bg-black/20 p-4">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/40">
                  <Sparkles size={12} />
                  Expression Flags
                </div>
                <div className="mt-3 flex gap-3">
                  <div
                    className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                      expressions.raised_eyebrows
                        ? 'border-amber-500/30 bg-amber-500/10 text-amber-300'
                        : 'border-white/10 bg-white/[0.03] text-white/40'
                    }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${
                        expressions.raised_eyebrows ? 'bg-amber-400' : 'bg-white/20'
                      }`}
                    />
                    Raised Eyebrows
                  </div>
                  <div
                    className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                      expressions.headshake
                        ? 'border-rose-500/30 bg-rose-500/10 text-rose-300'
                        : 'border-white/10 bg-white/[0.03] text-white/40'
                    }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${
                        expressions.headshake ? 'bg-rose-400' : 'bg-white/20'
                      }`}
                    />
                    Head Shake
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ============ Activity Log ============ */}
        <div className="mt-6 rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
          <div className="flex items-center gap-3 text-white/60">
            <Sparkles size={16} />
            <span className="text-sm uppercase tracking-[0.24em]">
              Activity Log
            </span>
            <span className="ml-auto text-xs text-white/30">
              {logs.length} events
            </span>
          </div>
          <div
            ref={logContainerRef}
            className="mt-4 max-h-36 space-y-1 overflow-y-auto pr-1 custom-scrollbar"
          >
            {logs.length > 0 ? (
              logs.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-start gap-3 rounded-lg px-2 py-1 text-xs transition hover:bg-white/[0.02]"
                >
                  <span className="shrink-0 font-mono text-white/25">
                    {entry.time}
                  </span>
                  <span
                    className={`shrink-0 w-16 text-right font-medium ${directionColors[entry.direction]}`}
                  >
                    {entry.direction}
                  </span>
                  <span className="text-white/55">{entry.message}</span>
                </div>
              ))
            ) : (
              <p className="text-center text-xs text-white/25">
                Start the camera or translate text to see activity here…
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
