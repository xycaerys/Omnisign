// GOOD: Flat hand from chin drops onto left palm
export const GOOD = (ref) => {

    let animations = []

    // Left arm out, palm flat
    animations.push(["mixamorigLeftArm", "rotation", "x", -Math.PI/6, "-"]);
    animations.push(["mixamorigLeftArm", "rotation", "z", -Math.PI/2.5, "-"]);
    animations.push(["mixamorigLeftForeArm", "rotation", "z", -Math.PI/6, "-"]);
    animations.push(["mixamorigLeftHand", "rotation", "x", Math.PI/6, "+"]);

    // Right hand at chin, open
    animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI/5, "-"]);
    animations.push(["mixamorigRightArm", "rotation", "z", Math.PI/2.5, "+"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", Math.PI/6, "+"]);
    animations.push(["mixamorigRightHand", "rotation", "x", -Math.PI/4, "-"]);

    ref.animations.push(animations);

    // Drop hand forward/down onto left palm
    animations = []
    animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI/8, "+"]);
    animations.push(["mixamorigRightHand", "rotation", "x", Math.PI/6, "+"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", 0, "-"]);
    ref.animations.push(animations);

    // Reset
    animations = []
    animations.push(["mixamorigLeftShoulder", "rotation", "z", -Math.PI/12, "+"]);
    animations.push(["mixamorigRightShoulder", "rotation", "z", Math.PI/12, "-"]);
    animations.push(["mixamorigLeftArm", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigLeftArm", "rotation", "z", -Math.PI/2.5, "+"]);
    animations.push(["mixamorigLeftForeArm", "rotation", "z", 0, "+"]);
    animations.push(["mixamorigLeftHand", "rotation", "x", 0, "-"]);
    animations.push(["mixamorigRightArm", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigRightArm", "rotation", "z", Math.PI/2.5, "-"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHand", "rotation", "x", 0, "+"]);
    ref.animations.push(animations);

    if(ref.pending === false){
        ref.pending = true;
        ref.animate();
    }
}
