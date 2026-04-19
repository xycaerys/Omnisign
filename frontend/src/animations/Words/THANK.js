// THANK: Flat hand moves away from chin/mouth forward
export const THANK = (ref) => {

    let animations = []

    // Raise right hand to chin, open palm
    animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI/5, "-"]);
    animations.push(["mixamorigRightArm", "rotation", "z", Math.PI/2.5, "+"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", Math.PI/6, "+"]);
    animations.push(["mixamorigRightHand", "rotation", "x", -Math.PI/4, "-"]);
    animations.push(["mixamorigRightHand", "rotation", "z", Math.PI/6, "+"]);

    ref.animations.push(animations);

    // Move hand forward+down (away from chin)
    animations = []
    animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI/9, "+"]);
    animations.push(["mixamorigRightHand", "rotation", "x", Math.PI/6, "+"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", 0, "-"]);
    ref.animations.push(animations);

    // Reset
    animations = []
    animations.push(["mixamorigLeftShoulder", "rotation", "z", -Math.PI/12, "+"]);
    animations.push(["mixamorigRightShoulder", "rotation", "z", Math.PI/12, "-"]);
    animations.push(["mixamorigRightArm", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigRightArm", "rotation", "z", Math.PI/2.5, "-"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHand", "rotation", "x", 0, "-"]);
    animations.push(["mixamorigRightHand", "rotation", "z", 0, "-"]);
    ref.animations.push(animations);

    if(ref.pending === false){
        ref.pending = true;
        ref.animate();
    }
}
