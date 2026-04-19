// HELLO: Open palm wave beside head (ASL)
export const HELLO = (ref) => {

    let animations = []

    // Raise right arm up, hand open
    animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI/6, "-"]);
    animations.push(["mixamorigRightArm", "rotation", "z", Math.PI/2.5, "+"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", Math.PI/4, "+"]);
    animations.push(["mixamorigRightHand", "rotation", "x", -Math.PI/6, "-"]);

    ref.animations.push(animations);

    // Wave right
    animations = []
    animations.push(["mixamorigRightHand", "rotation", "y", Math.PI/5, "+"]);
    ref.animations.push(animations);

    // Wave left
    animations = []
    animations.push(["mixamorigRightHand", "rotation", "y", -Math.PI/5, "-"]);
    ref.animations.push(animations);

    // Wave right
    animations = []
    animations.push(["mixamorigRightHand", "rotation", "y", Math.PI/5, "+"]);
    ref.animations.push(animations);

    // Wave left
    animations = []
    animations.push(["mixamorigRightHand", "rotation", "y", -Math.PI/5, "-"]);
    ref.animations.push(animations);

    // Reset
    animations = []
    animations.push(["mixamorigLeftShoulder", "rotation", "z", -Math.PI/12, "+"]);
    animations.push(["mixamorigRightShoulder", "rotation", "z", Math.PI/12, "-"]);
    animations.push(["mixamorigRightArm", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigRightArm", "rotation", "z", Math.PI/2.5, "-"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHand", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigRightHand", "rotation", "y", 0, "+"]);
    ref.animations.push(animations);

    if(ref.pending === false){
        ref.pending = true;
        ref.animate();
    }
}
