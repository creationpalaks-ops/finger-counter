const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const countText = document.getElementById("count");

canvas.width = 640;
canvas.height = 480;

function countFingers(landmarks) {
  let count = 0;

  // Thumb
  if (landmarks[4].x < landmarks[3].x) count++;

  // Other fingers
  if (landmarks[8].y < landmarks[6].y) count++;   // Index
  if (landmarks[12].y < landmarks[10].y) count++; // Middle
  if (landmarks[16].y < landmarks[14].y) count++; // Ring
  if (landmarks[20].y < landmarks[18].y) count++; // Pinky

  return count;
}

const hands = new Hands({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
  }
});

hands.setOptions({
  maxNumHands: 1,
  minDetectionConfidence: 0.7,
  minTrackingConfidence: 0.7
});

hands.onResults((results) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

  if (results.multiHandLandmarks.length > 0) {
    const landmarks = results.multiHandLandmarks[0];
    const fingerCount = countFingers(landmarks);
    countText.innerText = "Fingers: " + fingerCount;
  }
});

const camera = new Camera(video, {
  onFrame: async () => {
    await hands.send({ image: video });
  },
  width: 640,
  height: 480
});

camera.start();

