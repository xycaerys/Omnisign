// YES: S-fist nods (wrist bends forward repeatedly)
export const YES = (ref) => {

    let animations = []

    // Right fist raised
    animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI/6, "-"]);
    animations.push(["mixamorigRightArm", "rotation", "z", Math.PI/2.5, "+"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", Math.PI/4, "+"]);

    // Fist: curl all fingers
    animations.push(["mixamorigRightHandIndex1", "rotation", "z", Math.PI/2, "+"]);
    animations.push(["mixamorigRightHandIndex2", "rotation", "z", Math.PI/2, "+"]);
    animations.push(["mixamorigRightHandIndex3", "rotation", "z", Math.PI/2, "+"]);
    animations.push(["mixamorigRightHandMiddle1", "rotation", "z", Math.PI/2, "+"]);
    animations.push(["mixamorigRightHandMiddle2", "rotation", "z", Math.PI/2, "+"]);
    animations.push(["mixamorigRightHandMiddle3", "rotation", "z", Math.PI/2, "+"]);
    animations.push(["mixamorigRightHandRing1", "rotation", "z", Math.PI/2, "+"]);
    animations.push(["mixamorigRightHandRing2", "rotation", "z", Math.PI/2, "+"]);
    animations.push(["mixamorigRightHandRing3", "rotation", "z", Math.PI/2, "+"]);
    animations.push(["mixamorigRightHandPinky1", "rotation", "z", Math.PI/2, "+"]);
    animations.push(["mixamorigRightHandPinky2", "rotation", "z", Math.PI/2, "+"]);
    animations.push(["mixamorigRightHandPinky3", "rotation", "z", Math.PI/2, "+"]);
    animations.push(["mixamorigRightHandThumb2", "rotation", "y", -Math.PI/2.5, "-"]);
    animations.push(["mixamorigRightHandThumb3", "rotation", "y", -Math.PI/2.5, "-"]);

    animations.push(["mixamorigRightHand", "rotation", "x", -Math.PI/4, "-"]);

    ref.animations.push(animations);

    // Nod down
    animations = []
    animations.push(["mixamorigRightHand", "rotation", "x", Math.PI/6, "+"]);
    ref.animations.push(animations);

    // Nod up
    animations = []
    animations.push(["mixamorigRightHand", "rotation", "x", -Math.PI/4, "-"]);
    ref.animations.push(animations);

    // Nod down again
    animations = []
    animations.push(["mixamorigRightHand", "rotation", "x", Math.PI/6, "+"]);
    ref.animations.push(animations);

    // Reset
    animations = []
    animations.push(["mixamorigLeftShoulder", "rotation", "z", -Math.PI/12, "+"]);
    animations.push(["mixamorigRightShoulder", "rotation", "z", Math.PI/12, "-"]);
    animations.push(["mixamorigRightArm", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigRightArm", "rotation", "z", Math.PI/2.5, "-"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHand", "rotation", "x", 0, "-"]);
    animations.push(["mixamorigRightHandIndex1", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandIndex2", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandIndex3", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandMiddle1", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandMiddle2", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandMiddle3", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandRing1", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandRing2", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandRing3", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandPinky1", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandPinky2", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandPinky3", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandThumb2", "rotation", "y", 0, "+"]);
    animations.push(["mixamorigRightHandThumb3", "rotation", "y", 0, "+"]);
    ref.animations.push(animations);

    if(ref.pending === false){
        ref.pending = true;
        ref.animate();
    }
}
