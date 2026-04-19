// PLEASE: Open palm circles on chest
export const PLEASE = (ref) => {

    let animations = []

    // Right flat hand on chest
    animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI/8, "-"]);
    animations.push(["mixamorigRightArm", "rotation", "z", Math.PI/6, "+"]);
    animations.push(["mixamorigRightHand", "rotation", "z", Math.PI/6, "+"]);

    ref.animations.push(animations);

    // Circle part 1
    animations = []
    animations.push(["mixamorigRightHand", "rotation", "x", -Math.PI/8, "-"]);
    animations.push(["mixamorigRightHand", "rotation", "z", Math.PI/4, "+"]);
    ref.animations.push(animations);

    // Circle part 2
    animations = []
    animations.push(["mixamorigRightHand", "rotation", "x", Math.PI/8, "+"]);
    animations.push(["mixamorigRightHand", "rotation", "z", 0, "-"]);
    ref.animations.push(animations);

    // Circle part 3
    animations = []
    animations.push(["mixamorigRightHand", "rotation", "x", -Math.PI/8, "-"]);
    animations.push(["mixamorigRightHand", "rotation", "z", Math.PI/4, "+"]);
    ref.animations.push(animations);

    // Circle part 4
    animations = []
    animations.push(["mixamorigRightHand", "rotation", "x", Math.PI/8, "+"]);
    animations.push(["mixamorigRightHand", "rotation", "z", 0, "-"]);
    ref.animations.push(animations);

    // Reset
    animations = []
    animations.push(["mixamorigLeftShoulder", "rotation", "z", -Math.PI/12, "+"]);
    animations.push(["mixamorigRightShoulder", "rotation", "z", Math.PI/12, "-"]);
    animations.push(["mixamorigRightArm", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigRightArm", "rotation", "z", Math.PI/2.5, "+"]);
    animations.push(["mixamorigRightHand", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigRightHand", "rotation", "z", 0, "-"]);
    ref.animations.push(animations);

    if(ref.pending === false){
        ref.pending = true;
        ref.animate();
    }
}
