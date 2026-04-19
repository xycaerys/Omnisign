// MORE: Both flat-O (pinched) hands tap fingertips together
export const MORE = (ref) => {

    let animations = []

    // Left arm up, pinched fingers
    animations.push(["mixamorigLeftArm", "rotation", "x", -Math.PI/6, "-"]);
    animations.push(["mixamorigLeftArm", "rotation", "z", -Math.PI/2.5, "-"]);
    animations.push(["mixamorigLeftForeArm", "rotation", "z", -Math.PI/6, "-"]);
    animations.push(["mixamorigLeftHandIndex1", "rotation", "z", -Math.PI/3, "-"]);
    animations.push(["mixamorigLeftHandIndex2", "rotation", "z", -Math.PI/4, "-"]);
    animations.push(["mixamorigLeftHandMiddle1", "rotation", "z", -Math.PI/3, "-"]);
    animations.push(["mixamorigLeftHandMiddle2", "rotation", "z", -Math.PI/4, "-"]);
    animations.push(["mixamorigLeftHandRing1", "rotation", "z", -Math.PI/3, "-"]);
    animations.push(["mixamorigLeftHandRing2", "rotation", "z", -Math.PI/4, "-"]);
    animations.push(["mixamorigLeftHandPinky1", "rotation", "z", -Math.PI/3, "-"]);
    animations.push(["mixamorigLeftHandPinky2", "rotation", "z", -Math.PI/4, "-"]);
    animations.push(["mixamorigLeftHandThumb1", "rotation", "y", -Math.PI/4, "-"]);

    // Right arm up, pinched fingers
    animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI/6, "-"]);
    animations.push(["mixamorigRightArm", "rotation", "z", Math.PI/2.5, "+"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", Math.PI/6, "+"]);
    animations.push(["mixamorigRightHandIndex1", "rotation", "z", Math.PI/3, "+"]);
    animations.push(["mixamorigRightHandIndex2", "rotation", "z", Math.PI/4, "+"]);
    animations.push(["mixamorigRightHandMiddle1", "rotation", "z", Math.PI/3, "+"]);
    animations.push(["mixamorigRightHandMiddle2", "rotation", "z", Math.PI/4, "+"]);
    animations.push(["mixamorigRightHandRing1", "rotation", "z", Math.PI/3, "+"]);
    animations.push(["mixamorigRightHandRing2", "rotation", "z", Math.PI/4, "+"]);
    animations.push(["mixamorigRightHandPinky1", "rotation", "z", Math.PI/3, "+"]);
    animations.push(["mixamorigRightHandPinky2", "rotation", "z", Math.PI/4, "+"]);
    animations.push(["mixamorigRightHandThumb2", "rotation", "y", -Math.PI/4, "-"]);

    ref.animations.push(animations);

    // Tap fingertips together (bring forearms inward)
    animations = []
    animations.push(["mixamorigLeftForeArm", "rotation", "z", 0, "+"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", 0, "-"]);
    ref.animations.push(animations);

    // Separate
    animations = []
    animations.push(["mixamorigLeftForeArm", "rotation", "z", -Math.PI/6, "-"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", Math.PI/6, "+"]);
    ref.animations.push(animations);

    // Tap again
    animations = []
    animations.push(["mixamorigLeftForeArm", "rotation", "z", 0, "+"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", 0, "-"]);
    ref.animations.push(animations);

    // Reset
    animations = []
    animations.push(["mixamorigLeftShoulder", "rotation", "z", -Math.PI/12, "+"]);
    animations.push(["mixamorigRightShoulder", "rotation", "z", Math.PI/12, "-"]);
    animations.push(["mixamorigLeftArm", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigLeftArm", "rotation", "z", -Math.PI/2.5, "+"]);
    animations.push(["mixamorigLeftForeArm", "rotation", "z", 0, "+"]);
    animations.push(["mixamorigLeftHandIndex1", "rotation", "z", 0, "+"]);
    animations.push(["mixamorigLeftHandIndex2", "rotation", "z", 0, "+"]);
    animations.push(["mixamorigLeftHandMiddle1", "rotation", "z", 0, "+"]);
    animations.push(["mixamorigLeftHandMiddle2", "rotation", "z", 0, "+"]);
    animations.push(["mixamorigLeftHandRing1", "rotation", "z", 0, "+"]);
    animations.push(["mixamorigLeftHandRing2", "rotation", "z", 0, "+"]);
    animations.push(["mixamorigLeftHandPinky1", "rotation", "z", 0, "+"]);
    animations.push(["mixamorigLeftHandPinky2", "rotation", "z", 0, "+"]);
    animations.push(["mixamorigLeftHandThumb1", "rotation", "y", 0, "+"]);
    animations.push(["mixamorigRightArm", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigRightArm", "rotation", "z", Math.PI/2.5, "-"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", 0, "-"]);
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
