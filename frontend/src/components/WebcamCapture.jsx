import React, { useEffect, useRef, useState } from 'react';
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';
import { Camera, CameraOff } from 'lucide-react';

const WebcamCapture = ({ onSignDetected }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const requestRef = useRef(null);
  
  const [targetWord, setTargetWord] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState('Camera off.');

  const handLandmarkerRef = useRef(null);
  const streamRef = useRef(null);
  const lastVideoTimeRef = useRef(-1);
  const lastSentRef = useRef(0);

  useEffect(() => {
    const initModel = async () => {
      setStatus('Loading HandLandmarker model...');
      const vision = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm'
      );
      handLandmarkerRef.current = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
          delegate: 'GPU'
        },
        runningMode: 'VIDEO',
        numHands: 1
      });
      setStatus('Model loaded. Ready to start.');
    };
    initModel();

    return () => {
      stopCamera();
    };
  }, []);

  const drawLandmarks = (landmarks) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set internal resolution based on CSS size
    const rect = canvas.getBoundingClientRect();
    if (canvas.width !== rect.width || canvas.height !== rect.height) {
      canvas.width = rect.width;
      canvas.height = rect.height;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#10b981';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;

    for (const point of landmarks) {
      const x = (1 - point.x) * canvas.width; // Flipped horizontally
      const y = point.y * canvas.height;
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
  };

  const sendKeypoints = async (landmarks) => {
    const now = Date.now();
    if (now - lastSentRef.current < 120) return; // limit to ~8 fps
    lastSentRef.current = now;

    const keypoints = landmarks.map((p) => [
      Number(p.x.toFixed(5)),
      Number(p.y.toFixed(5)),
      Number((p.z || 0).toFixed(5))
    ]);

    try {
      const response = await fetch('http://127.0.0.1:8000/sign-to-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          keypoints,
          timestamp: now
        })
      });

      if (!response.ok) return;

      const data = await response.json();
      setTargetWord(data.word);
      if (onSignDetected) {
        onSignDetected(data);
      }
    } catch (e) {
      console.error("Backend error:", e);
    }
  };

  const loop = async () => {
    if (!isRunning || !videoRef.current) return;

    if (videoRef.current.currentTime !== lastVideoTimeRef.current) {
      lastVideoTimeRef.current = videoRef.current.currentTime;
      
      if (handLandmarkerRef.current) {
        const result = handLandmarkerRef.current.detectForVideo(videoRef.current, performance.now());
        const landmarks = result.landmarks && result.landmarks[0];
        
        if (landmarks) {
          drawLandmarks(landmarks);
          await sendKeypoints(landmarks);
        } else {
          const canvas = canvasRef.current;
          const ctx = canvas.getContext('2d');
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      }
    }

    requestRef.current = requestAnimationFrame(loop);
  };

  useEffect(() => {
    if (isRunning) {
      requestRef.current = requestAnimationFrame(loop);
    } else {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isRunning]);

  const startCamera = async () => {
    try {
      console.log('Requesting camera access...');
      setStatus('Starting camera...');
      
      // Try to get a stream with more flexible requirements
      const constraints = {
        video: { 
          width: { ideal: 640 }, 
          height: { ideal: 480 },
          facingMode: "user" 
        },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log('Stream acquired:', stream.id);
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // Wait for video to actually be ready to play
        await new Promise((resolve) => {
          videoRef.current.onloadedmetadata = () => {
            console.log('Video metadata loaded');
            resolve();
          };
        });
        
        await videoRef.current.play();
        console.log('Video playing');
      }
      
      setIsRunning(true);
      setStatus('Camera running.');
    } catch (e) {
      console.error('Camera start failed:', e);
      setStatus(`Error: ${e.message}`);
    }
  };

  const stopCamera = () => {
    setIsRunning(false);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    setStatus('Camera stopped.');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '1rem' }}>
      
      {/* Side-by-side views */}
      <div style={{ display: 'flex', gap: '1rem', flex: 1, minHeight: '300px' }}>
        
        {/* Camera View */}
        <div className="canvas-container" style={{ position: 'relative', flex: 1, overflow: 'hidden', borderRadius: '12px' }}>
          <video 
            ref={videoRef} 
            style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} 
            muted 
            playsInline
          />
          
          {!isRunning && (
            <div 
              style={{ 
                position: 'absolute', 
                inset: 0, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                background: 'rgba(0,0,0,0.85)', 
                color: '#fff', 
                backdropFilter: 'blur(8px)',
                zIndex: 20
              }}
            >
              <div style={{ textAlign: 'center', padding: '1rem' }}>
                <button 
                  onClick={startCamera}
                  className="button primary"
                  style={{ 
                    padding: '1.5rem 2.5rem', 
                    fontSize: '1.1rem', 
                    borderRadius: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1rem',
                    boxShadow: '0 0 30px rgba(59, 130, 246, 0.4)',
                    transition: 'transform 0.2s ease'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <Camera size={32} />
                  <span>ACTIVATE CAMERA</span>
                </button>
                <p style={{ marginTop: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  {status || 'Click to start sign detection'}
                </p>
              </div>
            </div>
          )}
        </div>
        
        {/* Skeleton Debug View */}
        <div className="canvas-container" style={{ position: 'relative', flex: 1, background: '#ffffff', borderRadius: '12px', overflow: 'hidden' }}>
          <canvas 
            ref={canvasRef} 
            style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 10 }}
          />
          {!isRunning && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
              Skeleton View
            </div>
          )}
        </div>

      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button 
          className={`button ${isRunning ? '' : 'primary'}`}
          onClick={isRunning ? stopCamera : startCamera}
        >
          {isRunning ? <CameraOff size={20} /> : <Camera size={20} />}
          {isRunning ? 'Stop Camera' : 'Start Camera'}
        </button>

        {targetWord && (
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-color)', textTransform: 'uppercase', letterSpacing: '2px' }}>
            {targetWord}
          </div>
        )}
      </div>
    </div>
  );
};

export default WebcamCapture;
