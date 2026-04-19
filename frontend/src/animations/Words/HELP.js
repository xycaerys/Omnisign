// HELP: Broad frame. Left hand flat in center, Right fist on top.
export const HELP = (ref) => {
    let animations = []

    // Frame setup (Broad)
    animations.push(["mixamorigLeftShoulder", "rotation", "z", -Math.PI/8, "-"]);
    animations.push(["mixamorigRightShoulder", "rotation", "z", Math.PI/8, "+"]);

    // Left hand flat in front (lower chest)
    animations.push(["mixamorigLeftArm", "rotation", "x", -Math.PI/5, "-"]);
    animations.push(["mixamorigLeftArm", "rotation", "z", -Math.PI/3.5, "-"]);
    animations.push(["mixamorigLeftForeArm", "rotation", "y", -Math.PI/6, "-"]);
    animations.push(["mixamorigLeftHand", "rotation", "x", Math.PI/6, "+"]);

    // Right hand fist
    animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI/4, "-"]);
    animations.push(["mixamorigRightArm", "rotation", "z", Math.PI/3.5, "+"]);
    animations.push(["mixamorigRightForeArm", "rotation", "y", Math.PI/6, "+"]);
    animations.push(["mixamorigRightHandIndex1", "rotation", "z", Math.PI/2, "+"]);
    animations.push(["mixamorigRightHandMiddle1", "rotation", "z", Math.PI/2, "+"]);
    animations.push(["mixamorigRightHandRing1", "rotation", "z", Math.PI/2, "+"]);
    animations.push(["mixamorigRightHandPinky1", "rotation", "z", Math.PI/2, "+"]);
    animations.push(["mixamorigRightHandThumb2", "rotation", "y", -Math.PI/2.5, "-"]);

    ref.animations.push(animations);

    // Rise upward
    animations = []
    animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI/3.5, "-"]);
    animations.push(["mixamorigLeftArm", "rotation", "x", -Math.PI/3.5, "-"]);
    ref.animations.push(animations);

    // Reset (Broad frame)
    animations = []
    animations.push(["mixamorigLeftShoulder", "rotation", "z", -Math.PI/8, "+"]);
    animations.push(["mixamorigRightShoulder", "rotation", "z", Math.PI/8, "-"]);
    animations.push(["mixamorigLeftArm", "rotation", "z", -Math.PI/2.2, "+"]);
    animations.push(["mixamorigRightArm", "rotation", "z", Math.PI/2.2, "-"]);
    animations.push(["mixamorigLeftForeArm", "rotation", "y", -Math.PI/3, "-"]);
    animations.push(["mixamorigRightForeArm", "rotation", "y", Math.PI/3, "+"]);
    animations.push(["mixamorigLeftArm", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigRightArm", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigLeftHand", "rotation", "x", 0, "-"]);
    animations.push(["mixamorigRightHandIndex1", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandMiddle1", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandRing1", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandPinky1", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandThumb2", "rotation", "y", 0, "+"]);
    ref.animations.push(animations);

    if(ref.pending === false){
        ref.pending = true;
        ref.animate();
    }
}
