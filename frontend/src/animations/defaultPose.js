export const defaultPose = (ref) => {
    ref.characters.push(' ')
    let animations = []
    
    // Broaden shoulders lightly
    animations.push(["mixamorigLeftShoulder", "rotation", "z", -Math.PI/8, "-"]);
    animations.push(["mixamorigRightShoulder", "rotation", "z", Math.PI/8, "+"]);
    animations.push(["mixamorigNeck", "rotation", "x", Math.PI/12, "+"]);
    
    // Upper Arms slightly forward and down
    animations.push(["mixamorigLeftArm", "rotation", "x", -0.5, "-"]);
    animations.push(["mixamorigLeftArm", "rotation", "z", -1.2, "-"]);
    animations.push(["mixamorigRightArm", "rotation", "x", -0.5, "-"]);
    animations.push(["mixamorigRightArm", "rotation", "z", 1.2, "+"]);
    
    // Forearms bent UP/FORWARD 90 degrees
    animations.push(["mixamorigLeftForeArm", "rotation", "x", 1.5, "+"]);
    animations.push(["mixamorigRightForeArm", "rotation", "x", 1.5, "+"]);
    
    // Hands
    animations.push(["mixamorigRightHand", "rotation", "x", -0.2, "-"]);
    animations.push(["mixamorigLeftHand", "rotation", "x", -0.2, "-"]);
    
    // Curl fingers
    animations.push(["mixamorigRightHandIndex1", "rotation", "x", 0.4, "+"]);
    animations.push(["mixamorigRightHandMiddle1", "rotation", "x", 0.4, "+"]);
    animations.push(["mixamorigRightHandRing1", "rotation", "x", 0.4, "+"]);
    animations.push(["mixamorigRightHandPinky1", "rotation", "x", 0.4, "+"]);
    animations.push(["mixamorigRightHandThumb1", "rotation", "x", 0.2, "+"]);
    
    animations.push(["mixamorigLeftHandIndex1", "rotation", "x", 0.4, "+"]);
    animations.push(["mixamorigLeftHandMiddle1", "rotation", "x", 0.4, "+"]);
    animations.push(["mixamorigLeftHandRing1", "rotation", "x", 0.4, "+"]);
    animations.push(["mixamorigLeftHandPinky1", "rotation", "x", 0.4, "+"]);
    animations.push(["mixamorigLeftHandThumb1", "rotation", "x", 0.2, "+"]);
    
    ref.animations.push(animations);

    if(ref.pending === false){
      ref.pending = true;
      ref.animate();
    }
}
