// Global Variables
let canvasWidth = 640;
let canvasHeight = 480;
let maxNumHands = 2;
let modelComplexity = 1;
let minDetectionConfidence = 0.5;
let minTrackingConfidence = 0.5;
let connectorColor = '#0000FF';
let connectorLineWidth = 5;
let landmarkColor = '#FF0000';
let landmarkLineWidth = 2;
let landmarkRadius = 3;
let videoWidth = 640;
let videoHeight = 480;

// Video and Canvas Setup
const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');

canvasElement.width = canvasWidth;
canvasElement.height = canvasHeight;

// onResults Function
function onResults(results) {
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(
    results.image,
    0,
    0,
    canvasElement.width,
    canvasElement.height
  );

  if (results.multiHandLandmarks) {
    for (const landmarks of results.multiHandLandmarks) {
      drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {
        color: connectorColor,
        lineWidth: connectorLineWidth,
      });
      drawLandmarks(canvasCtx, landmarks, {
        color: landmarkColor,
        lineWidth: landmarkLineWidth,
        radius: landmarkRadius,
      });
    }
  }
  canvasCtx.restore();
}

// MediaPipe Hands Setup
const hands = new Hands({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
  },
});

hands.setOptions({
  maxNumHands: maxNumHands,
  modelComplexity: modelComplexity,
  minDetectionConfidence: minDetectionConfidence,
  minTrackingConfidence: minTrackingConfidence,
});

hands.onResults(onResults);

// Camera Setup
const camera = new Camera(videoElement, {
  onFrame: async () => {
    await hands.send({ image: videoElement });
  },
  width: videoWidth,
  height: videoHeight,
});

camera.start();
