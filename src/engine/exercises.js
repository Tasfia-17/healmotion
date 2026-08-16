/**
 * HealMotion - Exercise Library (Layer 3)
 * 
 * Each exercise defines:
 * - Form rules (angle thresholds per joint)
 * - Compensation rules (what to watch for)
 * - Rep detection state machine
 * - Difficulty variants
 */

export const EXERCISES = {
  'shoulder-flexion': {
    id: 'shoulder-flexion',
    name: 'Shoulder Flexion',
    description: 'Raise your arms forward and up to shoulder height, then lower slowly.',
    bodyArea: 'shoulder',
    difficulty: 'beginner',
    standardReps: 10,
    reducedReps: 6,
    icon: '🤸',
    instructions: [
      'Stand tall with arms by your sides',
      'Slowly raise both arms forward',
      'Lift until arms are at shoulder height',
      'Lower slowly with control',
    ],
    // Which joint angle to track for ROM / fatigue
    primaryJoint: 'leftShoulder',
    primaryJointRight: 'rightShoulder',
    // Form rules: joint must be within range during the "up" phase
    formRules: [
      {
        joint: 'leftElbow',
        range: [150, 180], // Arm should be mostly straight
        message: 'Try to keep your arm straighter as you lift',
      },
      {
        joint: 'rightElbow',
        range: [150, 180],
        message: 'Try to keep your arm straighter as you lift',
      },
    ],
    // Compensation rules
    compensationRules: [
      {
        type: 'trunk_lean_shoulder',
        primaryJoint: 'leftShoulder',
        primaryRange: [60, 120], // Expected shoulder angle during lift
        compensatingJoint: 'trunkLean',
        compensatingNeutral: 0,
        compensatingThreshold: 10,
        message: 'You\'re leaning to compensate — try lifting with just your shoulders',
      },
    ],
    // Rep detection: state machine
    repDetection: {
      downAngle: { joint: 'leftShoulder', below: 30 },  // Arms at sides
      upAngle: { joint: 'leftShoulder', above: 70 },    // Arms raised
    },
    easierVariant: 'shoulder-flexion-seated',
  },

  'shoulder-flexion-seated': {
    id: 'shoulder-flexion-seated',
    name: 'Seated Shoulder Flexion',
    description: 'Sit tall and raise your arms forward to shoulder height.',
    bodyArea: 'shoulder',
    difficulty: 'easiest',
    standardReps: 8,
    reducedReps: 5,
    icon: '💺',
    instructions: [
      'Sit tall in a chair',
      'Raise both arms forward',
      'Lift to shoulder height',
      'Lower slowly',
    ],
    primaryJoint: 'leftShoulder',
    primaryJointRight: 'rightShoulder',
    formRules: [
      {
        joint: 'leftElbow',
        range: [140, 180],
        message: 'Keep your arm as straight as comfortable',
      },
    ],
    compensationRules: [],
    repDetection: {
      downAngle: { joint: 'leftShoulder', below: 30 },
      upAngle: { joint: 'leftShoulder', above: 60 },
    },
    easierVariant: null,
  },

  'knee-extension': {
    id: 'knee-extension',
    name: 'Seated Knee Extension',
    description: 'Sit tall and straighten your leg out in front, then lower with control.',
    bodyArea: 'knee',
    difficulty: 'beginner',
    standardReps: 10,
    reducedReps: 6,
    icon: '🦵',
    instructions: [
      'Sit tall in a sturdy chair',
      'Straighten one leg out in front',
      'Hold briefly at the top',
      'Lower slowly',
    ],
    primaryJoint: 'leftKnee',
    primaryJointRight: 'rightKnee',
    formRules: [
      {
        joint: 'leftKnee',
        range: [130, 180], // Leg should straighten
        message: 'Try to straighten your leg a bit more',
        phase: 'up',
      },
    ],
    compensationRules: [
      {
        type: 'hip_compensation',
        primaryJoint: 'leftKnee',
        primaryRange: [130, 180],
        compensatingJoint: 'leftHip',
        compensatingNeutral: 90,
        compensatingThreshold: 20,
        message: 'Keep your hip stable — focus on just the knee movement',
      },
    ],
    repDetection: {
      downAngle: { joint: 'leftKnee', below: 100 }, // Knee bent (sitting)
      upAngle: { joint: 'leftKnee', above: 145 },   // Knee extended
    },
    easierVariant: null,
  },

  'squat': {
    id: 'squat',
    name: 'Bodyweight Squat',
    description: 'Lower your body like sitting into a chair, then stand back up.',
    bodyArea: 'full-body',
    difficulty: 'intermediate',
    standardReps: 10,
    reducedReps: 6,
    icon: '🏋️',
    instructions: [
      'Stand with feet shoulder-width apart',
      'Lower your body as if sitting into a chair',
      'Keep your chest up and back straight',
      'Push through your heels to stand',
    ],
    primaryJoint: 'leftKnee',
    primaryJointRight: 'rightKnee',
    formRules: [
      {
        joint: 'leftKnee',
        range: [60, 130],
        message: 'Try to bend a little deeper through the knees',
        phase: 'down',
      },
      {
        joint: 'leftHip',
        range: [50, 120],
        message: 'Keep your chest lifted as you go down',
        phase: 'down',
      },
    ],
    compensationRules: [
      {
        type: 'knee_valgus',
        primaryJoint: 'leftKnee',
        primaryRange: [60, 130],
        compensatingJoint: 'trunkLean',
        compensatingNeutral: 0,
        compensatingThreshold: 12,
        message: 'Keep your weight centered — avoid shifting to one side',
      },
    ],
    repDetection: {
      downAngle: { joint: 'leftKnee', below: 110 }, // Squat position
      upAngle: { joint: 'leftKnee', above: 155 },   // Standing
    },
    easierVariant: 'chair-squat',
  },

  'chair-squat': {
    id: 'chair-squat',
    name: 'Chair-Assisted Squat',
    description: 'Use a chair for support as you lower and rise.',
    bodyArea: 'full-body',
    difficulty: 'beginner',
    standardReps: 8,
    reducedReps: 5,
    icon: '🪑',
    instructions: [
      'Stand in front of a chair',
      'Slowly lower until you touch the seat',
      'Push through your heels to stand',
    ],
    primaryJoint: 'leftKnee',
    primaryJointRight: 'rightKnee',
    formRules: [
      {
        joint: 'leftKnee',
        range: [70, 140],
        message: 'Nice work — lower just until you feel the chair',
      },
    ],
    compensationRules: [],
    repDetection: {
      downAngle: { joint: 'leftKnee', below: 120 },
      upAngle: { joint: 'leftKnee', above: 150 },
    },
    easierVariant: null,
  },

  'neck-rotation': {
    id: 'neck-rotation',
    name: 'Neck Rotation',
    description: 'Slowly turn your head left and right to improve neck mobility.',
    bodyArea: 'neck',
    difficulty: 'beginner',
    standardReps: 8,
    reducedReps: 5,
    icon: '🧘',
    instructions: [
      'Sit or stand tall',
      'Slowly turn your head to the left',
      'Return to center',
      'Turn to the right',
    ],
    primaryJoint: 'neckRotation',
    primaryJointRight: 'neckRotation',
    formRules: [],
    compensationRules: [
      {
        type: 'shoulder_raise',
        primaryJoint: 'leftShoulder',
        primaryRange: [0, 30],
        compensatingJoint: 'rightShoulder',
        compensatingNeutral: 15,
        compensatingThreshold: 15,
        message: 'Keep your shoulders relaxed and down',
      },
    ],
    repDetection: {
      downAngle: { joint: 'neckRotation', below: 10 }, // Center
      upAngle: { joint: 'neckRotation', above: 25 },   // Rotated
    },
    easierVariant: null,
  },

  'hip-abduction': {
    id: 'hip-abduction',
    name: 'Standing Hip Abduction',
    description: 'Hold a support and lift your leg out to the side.',
    bodyArea: 'hip',
    difficulty: 'intermediate',
    standardReps: 10,
    reducedReps: 6,
    icon: '🦿',
    instructions: [
      'Hold a chair or wall for balance',
      'Lift one leg out to the side',
      'Keep your body upright',
      'Lower slowly with control',
    ],
    primaryJoint: 'leftHip',
    primaryJointRight: 'rightHip',
    formRules: [
      {
        joint: 'leftKnee',
        range: [160, 180],
        message: 'Keep your lifting leg straight',
      },
    ],
    compensationRules: [
      {
        type: 'trunk_lean_hip',
        primaryJoint: 'leftHip',
        primaryRange: [120, 180],
        compensatingJoint: 'trunkLean',
        compensatingNeutral: 0,
        compensatingThreshold: 10,
        message: 'Stay upright — avoid leaning away from the lifting leg',
      },
    ],
    repDetection: {
      downAngle: { joint: 'leftHip', below: 160 },
      upAngle: { joint: 'leftHip', above: 155 },
    },
    easierVariant: null,
  },

  'wrist-circles': {
    id: 'wrist-circles',
    name: 'Wrist Circles',
    description: 'Rotate your wrists in circles to improve mobility.',
    bodyArea: 'wrist',
    difficulty: 'easiest',
    standardReps: 10,
    reducedReps: 8,
    icon: '🤲',
    instructions: [
      'Extend your arms in front of you',
      'Make slow circles with your wrists',
      'Alternate clockwise and counter-clockwise',
    ],
    primaryJoint: 'leftElbow',
    primaryJointRight: 'rightElbow',
    formRules: [
      {
        joint: 'leftElbow',
        range: [150, 180],
        message: 'Keep your arms extended while circling',
      },
    ],
    compensationRules: [],
    repDetection: {
      downAngle: { joint: 'leftElbow', below: 170 },
      upAngle: { joint: 'leftElbow', above: 160 },
    },
    easierVariant: null,
  },
};

/**
 * Get exercises by body area
 */
export function getExercisesByArea(area) {
  return Object.values(EXERCISES).filter(e => e.bodyArea === area);
}

/**
 * Get all body areas available
 */
export function getBodyAreas() {
  const areas = new Set(Object.values(EXERCISES).map(e => e.bodyArea));
  return Array.from(areas);
}

/**
 * Get exercise by ID
 */
export function getExercise(id) {
  return EXERCISES[id] || null;
}
