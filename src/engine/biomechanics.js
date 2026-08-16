/**
 * HealMotion - Biomechanical Analysis Engine (Layer 2)
 * 
 * Computes joint angles, movement velocity, jerk analysis, symmetry index,
 * and compensation pattern detection from raw landmark data.
 */

// MediaPipe PoseLandmarker joint indices
export const LANDMARKS = {
  NOSE: 0,
  LEFT_EYE_INNER: 1,
  LEFT_EYE: 2,
  LEFT_EYE_OUTER: 3,
  RIGHT_EYE_INNER: 4,
  RIGHT_EYE: 5,
  RIGHT_EYE_OUTER: 6,
  LEFT_EAR: 7,
  RIGHT_EAR: 8,
  MOUTH_LEFT: 9,
  MOUTH_RIGHT: 10,
  LEFT_SHOULDER: 11,
  RIGHT_SHOULDER: 12,
  LEFT_ELBOW: 13,
  RIGHT_ELBOW: 14,
  LEFT_WRIST: 15,
  RIGHT_WRIST: 16,
  LEFT_PINKY: 17,
  RIGHT_PINKY: 18,
  LEFT_INDEX: 19,
  RIGHT_INDEX: 20,
  LEFT_THUMB: 21,
  RIGHT_THUMB: 22,
  LEFT_HIP: 23,
  RIGHT_HIP: 24,
  LEFT_KNEE: 25,
  RIGHT_KNEE: 26,
  LEFT_ANKLE: 27,
  RIGHT_ANKLE: 28,
  LEFT_HEEL: 29,
  RIGHT_HEEL: 30,
  LEFT_FOOT_INDEX: 31,
  RIGHT_FOOT_INDEX: 32,
};

/**
 * Calculate angle between three points (in degrees)
 * pointA -> vertex -> pointC
 */
export function calculateAngle(pointA, vertex, pointC) {
  if (!pointA || !vertex || !pointC) return null;

  const vA = { x: pointA.x - vertex.x, y: pointA.y - vertex.y, z: (pointA.z || 0) - (vertex.z || 0) };
  const vC = { x: pointC.x - vertex.x, y: pointC.y - vertex.y, z: (pointC.z || 0) - (vertex.z || 0) };

  const dot = vA.x * vC.x + vA.y * vC.y + vA.z * vC.z;
  const magA = Math.sqrt(vA.x * vA.x + vA.y * vA.y + vA.z * vA.z);
  const magC = Math.sqrt(vC.x * vC.x + vC.y * vC.y + vC.z * vC.z);

  if (magA === 0 || magC === 0) return null;

  const cosAngle = Math.max(-1, Math.min(1, dot / (magA * magC)));
  return (Math.acos(cosAngle) * 180) / Math.PI;
}

/**
 * Compute all major joint angles from landmarks
 */
export function computeAllJointAngles(landmarks) {
  if (!landmarks || landmarks.length < 33) return null;

  const lm = landmarks;
  return {
    leftElbow: calculateAngle(lm[LANDMARKS.LEFT_SHOULDER], lm[LANDMARKS.LEFT_ELBOW], lm[LANDMARKS.LEFT_WRIST]),
    rightElbow: calculateAngle(lm[LANDMARKS.RIGHT_SHOULDER], lm[LANDMARKS.RIGHT_ELBOW], lm[LANDMARKS.RIGHT_WRIST]),
    leftShoulder: calculateAngle(lm[LANDMARKS.LEFT_HIP], lm[LANDMARKS.LEFT_SHOULDER], lm[LANDMARKS.LEFT_ELBOW]),
    rightShoulder: calculateAngle(lm[LANDMARKS.RIGHT_HIP], lm[LANDMARKS.RIGHT_SHOULDER], lm[LANDMARKS.RIGHT_ELBOW]),
    leftHip: calculateAngle(lm[LANDMARKS.LEFT_SHOULDER], lm[LANDMARKS.LEFT_HIP], lm[LANDMARKS.LEFT_KNEE]),
    rightHip: calculateAngle(lm[LANDMARKS.RIGHT_SHOULDER], lm[LANDMARKS.RIGHT_HIP], lm[LANDMARKS.RIGHT_KNEE]),
    leftKnee: calculateAngle(lm[LANDMARKS.LEFT_HIP], lm[LANDMARKS.LEFT_KNEE], lm[LANDMARKS.LEFT_ANKLE]),
    rightKnee: calculateAngle(lm[LANDMARKS.RIGHT_HIP], lm[LANDMARKS.RIGHT_KNEE], lm[LANDMARKS.RIGHT_ANKLE]),
    leftAnkle: calculateAngle(lm[LANDMARKS.LEFT_KNEE], lm[LANDMARKS.LEFT_ANKLE], lm[LANDMARKS.LEFT_FOOT_INDEX]),
    rightAnkle: calculateAngle(lm[LANDMARKS.RIGHT_KNEE], lm[LANDMARKS.RIGHT_ANKLE], lm[LANDMARKS.RIGHT_FOOT_INDEX]),
    // Trunk lean (using shoulder midpoint, hip midpoint, and vertical)
    trunkLean: computeTrunkLean(landmarks),
  };
}

/**
 * Compute trunk lateral lean angle
 */
function computeTrunkLean(landmarks) {
  const lm = landmarks;
  const shoulderMid = {
    x: (lm[LANDMARKS.LEFT_SHOULDER].x + lm[LANDMARKS.RIGHT_SHOULDER].x) / 2,
    y: (lm[LANDMARKS.LEFT_SHOULDER].y + lm[LANDMARKS.RIGHT_SHOULDER].y) / 2,
  };
  const hipMid = {
    x: (lm[LANDMARKS.LEFT_HIP].x + lm[LANDMARKS.RIGHT_HIP].x) / 2,
    y: (lm[LANDMARKS.LEFT_HIP].y + lm[LANDMARKS.RIGHT_HIP].y) / 2,
  };

  // Angle from vertical (a perfectly upright person = 0)
  const dx = shoulderMid.x - hipMid.x;
  const dy = shoulderMid.y - hipMid.y;
  // Positive = leaning right, Negative = leaning left
  return (Math.atan2(dx, -dy) * 180) / Math.PI;
}

/**
 * Compute symmetry index between left and right sides
 * Returns value 0-100 (100 = perfectly symmetric)
 */
export function computeSymmetryIndex(angles) {
  if (!angles) return null;

  const pairs = [
    ['leftElbow', 'rightElbow'],
    ['leftShoulder', 'rightShoulder'],
    ['leftHip', 'rightHip'],
    ['leftKnee', 'rightKnee'],
    ['leftAnkle', 'rightAnkle'],
  ];

  let totalDiff = 0;
  let validPairs = 0;

  for (const [left, right] of pairs) {
    if (angles[left] != null && angles[right] != null) {
      const maxAngle = Math.max(angles[left], angles[right]);
      if (maxAngle > 0) {
        const diff = Math.abs(angles[left] - angles[right]) / maxAngle;
        totalDiff += diff;
        validPairs++;
      }
    }
  }

  if (validPairs === 0) return null;
  const avgDiff = totalDiff / validPairs;
  return Math.round(Math.max(0, (1 - avgDiff) * 100));
}

/**
 * Movement velocity tracker - stores history and computes derivatives
 */
export class MovementAnalyzer {
  constructor(windowSize = 10) {
    this.windowSize = windowSize;
    this.history = []; // Array of { angles, timestamp }
    this.velocities = [];
    this.accelerations = [];
  }

  addFrame(angles, timestamp) {
    this.history.push({ angles, timestamp });
    if (this.history.length > this.windowSize) {
      this.history.shift();
    }

    this.computeDerivatives();
  }

  computeDerivatives() {
    if (this.history.length < 2) return;

    this.velocities = [];
    for (let i = 1; i < this.history.length; i++) {
      const dt = (this.history[i].timestamp - this.history[i - 1].timestamp) / 1000;
      if (dt === 0) continue;

      const vel = {};
      for (const joint of Object.keys(this.history[i].angles)) {
        const curr = this.history[i].angles[joint];
        const prev = this.history[i - 1].angles[joint];
        if (curr != null && prev != null) {
          vel[joint] = (curr - prev) / dt; // degrees per second
        }
      }
      this.velocities.push(vel);
    }

    // Acceleration (2nd derivative)
    this.accelerations = [];
    if (this.velocities.length >= 2) {
      for (let i = 1; i < this.velocities.length; i++) {
        const dt = (this.history[i + 1].timestamp - this.history[i].timestamp) / 1000;
        if (dt === 0) continue;
        const acc = {};
        for (const joint of Object.keys(this.velocities[i])) {
          const curr = this.velocities[i][joint];
          const prev = this.velocities[i - 1][joint];
          if (curr != null && prev != null) {
            acc[joint] = (curr - prev) / dt;
          }
        }
        this.accelerations.push(acc);
      }
    }
  }

  /**
   * Jerk analysis - measures smoothness of motion
   * Lower jerk = smoother motion = healthier movement
   * Returns normalized jerk metric (0 = perfectly smooth)
   */
  getJerkMetric() {
    if (this.accelerations.length < 2) return null;

    let totalJerk = 0;
    let count = 0;

    for (let i = 1; i < this.accelerations.length; i++) {
      for (const joint of Object.keys(this.accelerations[i])) {
        const curr = this.accelerations[i][joint];
        const prev = this.accelerations[i - 1][joint];
        if (curr != null && prev != null) {
          totalJerk += Math.abs(curr - prev);
          count++;
        }
      }
    }

    return count > 0 ? totalJerk / count : null;
  }

  /**
   * Get current movement velocity (average across joints)
   */
  getCurrentVelocity() {
    if (this.velocities.length === 0) return 0;
    const latest = this.velocities[this.velocities.length - 1];
    const values = Object.values(latest).filter(v => v != null);
    if (values.length === 0) return 0;
    return values.reduce((sum, v) => sum + Math.abs(v), 0) / values.length;
  }

  reset() {
    this.history = [];
    this.velocities = [];
    this.accelerations = [];
  }
}

/**
 * Compensation Pattern Detector
 * Based on kinetic chain theory - when one joint is weak/painful,
 * adjacent joints over-activate (compensate)
 */
export class CompensationDetector {
  constructor() {
    this.patterns = [];
    this.frameBuffer = [];
    this.bufferSize = 30; // ~1 second at 30fps
  }

  /**
   * Check for compensation patterns in current frame
   * Returns array of detected compensations
   */
  detect(angles, exercise) {
    if (!angles || !exercise) return [];

    this.frameBuffer.push(angles);
    if (this.frameBuffer.length > this.bufferSize) {
      this.frameBuffer.shift();
    }

    const detected = [];

    // Check each compensation rule for the current exercise
    for (const rule of (exercise.compensationRules || [])) {
      const primaryAngle = angles[rule.primaryJoint];
      const compensatingAngle = angles[rule.compensatingJoint];

      if (primaryAngle == null || compensatingAngle == null) continue;

      // Check if primary joint is within expected range
      const primaryInRange = primaryAngle >= rule.primaryRange[0] && primaryAngle <= rule.primaryRange[1];
      
      // Check if compensating joint is deviating beyond threshold
      const compensatingDeviation = Math.abs(compensatingAngle - rule.compensatingNeutral);
      const isCompensating = compensatingDeviation > rule.compensatingThreshold;

      if (!primaryInRange && isCompensating) {
        detected.push({
          type: rule.type,
          message: rule.message,
          severity: compensatingDeviation > rule.compensatingThreshold * 1.5 ? 'high' : 'moderate',
          primaryJoint: rule.primaryJoint,
          compensatingJoint: rule.compensatingJoint,
          deviation: compensatingDeviation,
        });
      }
    }

    // Global: trunk lean compensation (applicable to most exercises)
    if (angles.trunkLean != null && Math.abs(angles.trunkLean) > 12) {
      detected.push({
        type: 'trunk_lean',
        message: `Your body is leaning ${angles.trunkLean > 0 ? 'right' : 'left'} — try to stay centered`,
        severity: Math.abs(angles.trunkLean) > 20 ? 'high' : 'moderate',
        primaryJoint: 'trunk',
        compensatingJoint: 'trunk',
        deviation: Math.abs(angles.trunkLean),
      });
    }

    this.patterns = detected;
    return detected;
  }

  reset() {
    this.patterns = [];
    this.frameBuffer = [];
  }
}

/**
 * Fatigue Detector
 * Monitors ROM decline over reps to detect fatigue
 * Threshold: >15% ROM decrease = clinically significant fatigue
 */
export class FatigueDetector {
  constructor() {
    this.repROMs = []; // ROM values per rep
    this.fatigueLevel = 0; // 0-100
    this.isFatigued = false;
  }

  /**
   * Record the ROM achieved for a completed rep
   * @param {number} rom - Range of motion in degrees for the primary joint
   */
  addRep(rom) {
    this.repROMs.push(rom);
    this.computeFatigue();
  }

  computeFatigue() {
    if (this.repROMs.length < 3) {
      this.fatigueLevel = 0;
      this.isFatigued = false;
      return;
    }

    // Compare last 2 reps to first 2 reps
    const early = this.repROMs.slice(0, 2);
    const recent = this.repROMs.slice(-2);

    const earlyAvg = early.reduce((s, v) => s + v, 0) / early.length;
    const recentAvg = recent.reduce((s, v) => s + v, 0) / recent.length;

    if (earlyAvg === 0) return;

    const decline = ((earlyAvg - recentAvg) / earlyAvg) * 100;
    this.fatigueLevel = Math.max(0, Math.min(100, decline * 3)); // Scale to 0-100
    this.isFatigued = decline > 15; // >15% ROM decline = fatigued (Enoka & Duchateau, 2008)
  }

  getFatigueCurve() {
    return this.repROMs.map((rom, idx) => ({ rep: idx + 1, rom }));
  }

  reset() {
    this.repROMs = [];
    this.fatigueLevel = 0;
    this.isFatigued = false;
  }
}
