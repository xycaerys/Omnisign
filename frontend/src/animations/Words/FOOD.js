// FOOD: Flat O (pinched fingers) taps mouth repeatedly
export const FOOD = (ref) => {

    let animations = []

    // Raise right hand to mouth
    animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI/5, "-"]);
    animations.push(["mixamorigRightArm", "rotation", "z", Math.PI/2.5, "+"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", Math.PI/6, "+"]);

    // Pinch all fingers (flat O shape)
    animations.push(["mixamorigRightHandIndex1", "rotation", "z", Math.PI/3, "+"]);
    animations.push(["mixamorigRightHandIndex2", "rotation", "z", Math.PI/4, "+"]);
    animations.push(["mixamorigRightHandMiddle1", "rotation", "z", Math.PI/3, "+"]);
    animations.push(["mixamorigRightHandMiddle2", "rotation", "z", Math.PI/4, "+"]);
    animations.push(["mixamorigRightHandRing1", "rotation", "z", Math.PI/3, "+"]);
    animations.push(["mixamorigRightHandRing2", "rotation", "z", Math.PI/4, "+"]);
    animations.push(["mixamorigRightHandPinky1", "rotation", "z", Math.PI/3, "+"]);
    animations.push(["mixamorigRightHandPinky2", "rotation", "z", Math.PI/4, "+"]);
    animations.push(["mixamorigRightHandThumb2", "rotation", "y", -Math.PI/4, "-"]);

    animations.push(["mixamorigRightHand", "rotation", "x", -Math.PI/4, "-"]);

    ref.animations.push(animations);

    // Tap mouth
    animations = []
    animations.push(["mixamorigRightHand", "rotation", "x", Math.PI/8, "+"]);
    ref.animations.push(animations);

    // Pull back
    animations = []
    animations.push(["mixamorigRightHand", "rotation", "x", -Math.PI/4, "-"]);
    ref.animations.push(animations);

    // Tap again
    animations = []
    animations.push(["mixamorigRightHand", "rotation", "x", Math.PI/8, "+"]);
    ref.animations.push(animations);

    // Reset
    animations = []
    animations.push(["mixamorigLeftShoulder", "rotation", "z", -Math.PI/12, "+"]);
    animations.push(["mixamorigRightShoulder", "rotation", "z", Math.PI/12, "-"]);
    animations.push(["mixamorigRightArm", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigRightArm", "rotation", "z", Math.PI/2.5, "-"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHand", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigRightHandIndex1", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandIndex2", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandMiddle1", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandMiddle2", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandRing1", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandRing2", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandPinky1", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandPinky2", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandThumb2", "rotation", "y", 0, "+"]);
    ref.animations.push(animations);

    if(ref.pending === false){
        ref.pending = true;
        ref.animate();
    }
}
