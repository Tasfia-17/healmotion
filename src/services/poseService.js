import { PoseLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';

let poseLandmarker = null;
let lastVideoTime = -1;

export async function initPoseLandmarker() {
  if (poseLandmarker) return poseLandmarker;
  const vision = await FilesetResolver.forVisionTasks(
    'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
  );
  poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task',
      delegate: 'GPU',
    },
    runningMode: 'VIDEO',
    numPoses: 1,
    minPoseDetectionConfidence: 0.5,
    minPosePresenceConfidence: 0.5,
    minTrackingConfidence: 0.5,
  });
  return poseLandmarker;
}

export function detectPose(video) {
  if (!poseLandmarker || !video) return null;
  const currentTime = video.currentTime;
  if (currentTime === lastVideoTime) return null;
  lastVideoTime = currentTime;
  try {
    const results = poseLandmarker.detectForVideo(video, performance.now());
    if (results && results.landmarks && results.landmarks.length > 0) {
      return results.landmarks[0];
    }
  } catch (e) {
    console.warn('Pose detection error:', e);
  }
  return null;
}

export function drawLandmarks(canvasCtx, landmarks, canvasWidth, canvasHeight) {
  if (!landmarks || !canvasCtx) return;
  canvasCtx.clearRect(0, 0, canvasWidth, canvasHeight);

  const connections = [
    [11, 12], [11, 13], [13, 15], [12, 14], [14, 16],
    [11, 23], [12, 24], [23, 24], [23, 25], [24, 26],
    [25, 27], [26, 28], [27, 29], [28, 30], [27, 31], [28, 32],
  ];

  canvasCtx.strokeStyle = 'rgba(74, 158, 142, 0.7)';
  canvasCtx.lineWidth = 3;
  for (const [start, end] of connections) {
    const p1 = landmarks[start];
    const p2 = landmarks[end];
    if (p1 && p2) {
      canvasCtx.beginPath();
      canvasCtx.moveTo(p1.x * canvasWidth, p1.y * canvasHeight);
      canvasCtx.lineTo(p2.x * canvasWidth, p2.y * canvasHeight);
      canvasCtx.stroke();
    }
  }

  for (let i = 0; i < landmarks.length; i++) {
    const lm = landmarks[i];
    if (lm) {
      canvasCtx.beginPath();
      canvasCtx.arc(lm.x * canvasWidth, lm.y * canvasHeight, 5, 0, 2 * Math.PI);
      canvasCtx.fillStyle = i >= 11 ? '#e1894f' : 'rgba(225, 137, 79, 0.4)';
      canvasCtx.fill();
    }
  }
}

export function destroyPoseLandmarker() {
  if (poseLandmarker) { poseLandmarker.close(); poseLandmarker = null; }
  lastVideoTime = -1;
}
