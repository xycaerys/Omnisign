// BAD: Flat hand touches chin, then flips palm-down away
export const BAD = (ref) => {

    let animations = []

    // Right open hand at chin
    animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI/5, "-"]);
    animations.push(["mixamorigRightArm", "rotation", "z", Math.PI/2.5, "+"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", Math.PI/6, "+"]);
    animations.push(["mixamorigRightHand", "rotation", "x", -Math.PI/4, "-"]);

    ref.animations.push(animations);

    // Flip downward and away (palm faces down)
    animations = []
    animations.push(["mixamorigRightHand", "rotation", "x", Math.PI/4, "+"]);
    animations.push(["mixamorigRightHand", "rotation", "y", -Math.PI/4, "-"]);
    animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI/8, "+"]);
    ref.animations.push(animations);

    // Reset
    animations = []
    animations.push(["mixamorigLeftShoulder", "rotation", "z", -Math.PI/12, "+"]);
    animations.push(["mixamorigRightShoulder", "rotation", "z", Math.PI/12, "-"]);
    animations.push(["mixamorigRightArm", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigRightArm", "rotation", "z", Math.PI/2.5, "-"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHand", "rotation", "x", 0, "-"]);
    animations.push(["mixamorigRightHand", "rotation", "y", 0, "+"]);
    ref.animations.push(animations);

    if(ref.pending === false){
        ref.pending = true;
        ref.animate();
    }
}
