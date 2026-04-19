const canvas = document.getElementById('avatarCanvas');
const ctx = canvas.getContext('2d');
const statusOverlay = document.getElementById('statusOverlay');
const inputField = document.getElementById('tokenInput');
const playBtn = document.getElementById('playBtn');
const testBtns = document.querySelectorAll('.test-btn');

// --- 1. SKELETON DEFINITION --- //
// 21 points for a hand
const baseHand = [
    [200, 350], // 0: wrist
    [150, 310], [120, 260], [90, 220], [70, 180], // 1-4: Thumb
    [170, 250], [160, 180], [150, 120], [140, 70], // 5-8: Index
    [210, 240], [210, 160], [210, 90], [210, 30], // 9-12: Middle
    [250, 250], [260, 180], [270, 120], [280, 70], // 13-16: Ring
    [290, 270], [310, 210], [330, 160], [350, 110] // 17-20: Pinky
];

const connections = [
    [0,1], [1,2], [2,3], [3,4], // thumb
    [0,5], [5,6], [6,7], [7,8], // index
    [5,9], [9,10], [10,11], [11,12], // middle
    [9,13], [13,14], [14,15], [15,16], // ring
    [13,17], [17,18], [18,19], [19,20], // pinky
    [0,17] // palm boundary
];


// --- 2. ANIMATION GENERATION SETUP --- //
function transformHand(hand, tx, ty, angle, scale) {
    const cx = hand[0][0]; // rotate around wrist
    const cy = hand[0][1];
    
    return hand.map(pt => {
        let x = pt[0] - cx;
        let y = pt[1] - cy;
        
        // Rotate
        let rx = x * Math.cos(angle) - y * Math.sin(angle);
        let ry = x * Math.sin(angle) + y * Math.cos(angle);
        
        return [rx * scale + cx + tx, ry * scale + cy + ty];
    });
}

// Generate simple hardcoded animations (each is an array of frames, each frame is 21 points)
const animations = {
    "HELLO": [
        baseHand,
        transformHand(baseHand, 0, 0, 0.4, 1),
        transformHand(baseHand, 0, 0, -0.3, 1),
        transformHand(baseHand, 0, 0, 0.4, 1),
        transformHand(baseHand, 0, 0, -0.3, 1),
        baseHand
    ],
    "HELP": [
        baseHand,
        transformHand(baseHand, 0, -40, 0, 1),
        transformHand(baseHand, 0, -10, 0, 1),
        transformHand(baseHand, 0, -40, 0, 1),
        baseHand
    ],
    "WATER": [
        baseHand,
        transformHand(baseHand, -30, -30, -0.1, 0.9),
        transformHand(baseHand, -25, -25, -0.1, 0.95),
        transformHand(baseHand, -30, -30, -0.1, 0.9),
        baseHand
    ],
    "DOCTOR": [
        baseHand,
        transformHand(baseHand, -50, 50, -0.3, 1),
        transformHand(baseHand, -40, 40, -0.2, 1),
        transformHand(baseHand, -50, 50, -0.3, 1),
        baseHand
    ],
    "PAIN": [
        baseHand,
        transformHand(baseHand, 15, 0, 0.05, 1),
        transformHand(baseHand, -15, 0, -0.05, 1),
        transformHand(baseHand, 15, 0, 0.05, 1),
        transformHand(baseHand, -15, 0, -0.05, 1),
        baseHand
    ]
};


// --- 3. ANIMATION ENGINE --- //
let currentPoints = JSON.parse(JSON.stringify(baseHand));
let targetPoints = JSON.parse(JSON.stringify(baseHand));

let sequenceQueue = [];
let activeFrames = null;
let currentFrameIdx = 0;
let lerpProgress = 1.0; 
let isPlaying = false;

const LERP_SPEED = 0.15; // Speed of interpolation between frames

function update() {
    // If we've reached the target frame and there are more frames in the word
    if (lerpProgress >= 1.0) {
        if (activeFrames && currentFrameIdx < activeFrames.length - 1) {
            currentFrameIdx++;
            targetPoints = activeFrames[currentFrameIdx];
            lerpProgress = 0.0;
        } else if (sequenceQueue.length > 0) {
            // Move to next word in sequence
            nextWordInSequence();
        } else {
            // Sequence completely finished
            if (isPlaying) {
                isPlaying = false;
                statusOverlay.innerText = "READY";
            }
        }
    }

    // Interpolate points smoothly
    if (lerpProgress < 1.0) {
        lerpProgress += LERP_SPEED;
        if (lerpProgress > 1.0) lerpProgress = 1.0;

        for (let i = 0; i < currentPoints.length; i++) {
            currentPoints[i][0] = currentPoints[i][0] + (targetPoints[i][0] - currentPoints[i][0]) * lerpProgress;
            currentPoints[i][1] = currentPoints[i][1] + (targetPoints[i][1] - currentPoints[i][1]) * lerpProgress;
        }
    }

    render();
    requestAnimationFrame(update);
}

function render() {
    // 1. Clear Canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Glow effect
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#3b82f6';
    
    // 2. Draw Bones (Lines)
    ctx.beginPath();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    connections.forEach(conn => {
        const p1 = currentPoints[conn[0]];
        const p2 = currentPoints[conn[1]];
        ctx.moveTo(p1[0], p1[1]);
        ctx.lineTo(p2[0], p2[1]);
    });
    ctx.stroke();

    // 3. Draw Joints (Dots)
    ctx.shadowBlur = 5;
    ctx.shadowColor = '#fff';
    ctx.fillStyle = '#10b981'; // green joints

    currentPoints.forEach(pt => {
        ctx.beginPath();
        ctx.arc(pt[0], pt[1], 4, 0, Math.PI * 2);
        ctx.fill();
    });
}


// --- 4. SEQUENCE PLAYER --- //

function playSequence(tokens) {
    if (tokens.length === 0) return;
    
    // Filter tokens that exist in our animation library
    const validTokens = tokens.map(t => t.toUpperCase()).filter(t => animations[t]);
    
    if (validTokens.length === 0) {
        statusOverlay.innerText = "NO KNOWN TOKENS";
        return;
    }

    sequenceQueue = validTokens;
    isPlaying = true;
    nextWordInSequence();
}

function nextWordInSequence() {
    const word = sequenceQueue.shift();
    statusOverlay.innerText = "PLAYING: " + word;
    
    activeFrames = animations[word];
    currentFrameIdx = 0;
    
    targetPoints = activeFrames[0];
    lerpProgress = 0.0;
}

// Start Engine
requestAnimationFrame(update);


// --- 5. EVENT LISTENERS --- //

playBtn.addEventListener('click', () => {
    const text = inputField.value;
    const tokens = text.split(" ");
    playSequence(tokens);
});

testBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const word = e.target.getAttribute('data-word');
        playSequence([word]);
    });
});

// Helper integration function for future use
window.playAvatarSequence = playSequence;
