// STOP: Right flat hand chops down on left flat palm
export const STOP = (ref) => {

    let animations = []

    // Left arm out, flat palm up
    animations.push(["mixamorigLeftArm", "rotation", "x", -Math.PI/6, "-"]);
    animations.push(["mixamorigLeftArm", "rotation", "z", -Math.PI/2.5, "-"]);
    animations.push(["mixamorigLeftForeArm", "rotation", "z", -Math.PI/6, "-"]);
    animations.push(["mixamorigLeftHand", "rotation", "x", Math.PI/6, "+"]);

    // Right arm raised above, hand blade
    animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI/4, "-"]);
    animations.push(["mixamorigRightArm", "rotation", "z", Math.PI/2.5, "+"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", Math.PI/6, "+"]);
    animations.push(["mixamorigRightHand", "rotation", "x", -Math.PI/3, "-"]);
    animations.push(["mixamorigRightHand", "rotation", "z", Math.PI/4, "+"]);

    ref.animations.push(animations);

    // Chop down onto left palm
    animations = []
    animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI/6, "+"]);
    animations.push(["mixamorigRightHand", "rotation", "x", Math.PI/6, "+"]);
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
    animations.push(["mixamorigRightHand", "rotation", "z", 0, "-"]);
    ref.animations.push(animations);

    if(ref.pending === false){
        ref.pending = true;
        ref.animate();
    }
}
