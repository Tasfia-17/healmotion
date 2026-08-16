/**
 * HealMotion - Rep Counter & Adaptive Difficulty Engine (Layer 3)
 * 
 * State machine for rep detection, real-time difficulty adjustment,
 * and session tracking.
 */

import { FatigueDetector, CompensationDetector } from './biomechanics';

/**
 * Rep Counter - State machine for counting exercise repetitions
 */
export class RepCounter {
  constructor(exercise) {
    this.exercise = exercise;
    this.state = 'idle'; // idle -> down -> up -> idle (1 rep)
    this.repCount = 0;
    this.targetReps = exercise.standardReps;
    this.lastTransitionTime = Date.now();
    this.minTransitionMs = 300; // Minimum time between state changes (debounce)
    this.currentROM = 0;
    this.peakAngle = 0;
    this.troughAngle = 180;
  }

  /**
   * Process a frame and detect if a rep was completed
   * @returns {{ repCompleted: boolean, rom: number }}
   */
  processFrame(angles) {
    if (!angles || !this.exercise.repDetection) {
      return { repCompleted: false, rom: 0 };
    }

    const { downAngle, upAngle } = this.exercise.repDetection;
    const currentAngle = angles[downAngle.joint];

    if (currentAngle == null) return { repCompleted: false, rom: 0 };

    const now = Date.now();
    const timeSinceTransition = now - this.lastTransitionTime;

    let repCompleted = false;

    switch (this.state) {
      case 'idle':
        // Waiting for movement to start
        if (currentAngle > upAngle.above || currentAngle < downAngle.below) {
          this.state = currentAngle < downAngle.below ? 'down' : 'up';
          this.lastTransitionTime = now;
          this.troughAngle = currentAngle;
          this.peakAngle = currentAngle;
        }
        break;

      case 'down':
        // Track the lowest point
        this.troughAngle = Math.min(this.troughAngle, currentAngle);
        
        // Transition to 'up' when angle increases past threshold
        if (currentAngle > upAngle.above && timeSinceTransition > this.minTransitionMs) {
          this.state = 'up';
          this.peakAngle = currentAngle;
          this.lastTransitionTime = now;
        }
        break;

      case 'up':
        // Track the highest point
        this.peakAngle = Math.max(this.peakAngle, currentAngle);

        // Transition to 'down' when angle decreases past threshold = 1 rep complete
        if (currentAngle < downAngle.below && timeSinceTransition > this.minTransitionMs) {
          this.currentROM = Math.abs(this.peakAngle - this.troughAngle);
          this.repCount++;
          repCompleted = true;
          this.state = 'down';
          this.troughAngle = currentAngle;
          this.lastTransitionTime = now;
        }
        break;

      default:
        this.state = 'idle';
    }

    return { repCompleted, rom: this.currentROM };
  }

  reset() {
    this.state = 'idle';
    this.repCount = 0;
    this.currentROM = 0;
    this.peakAngle = 0;
    this.troughAngle = 180;
  }
}

/**
 * Adaptive Difficulty Controller
 * Adjusts exercise parameters in real-time based on performance
 */
export class AdaptiveDifficulty {
  constructor(exercise) {
    this.exercise = exercise;
    this.targetReps = exercise.standardReps;
    this.currentDifficulty = 'normal'; // 'easier', 'normal', 'harder'
    this.adaptations = []; // Log of adaptations made
    this.consecutiveGoodReps = 0;
    this.consecutiveBadReps = 0;
    this.fatigueDetector = new FatigueDetector();
    this.compensationDetector = new CompensationDetector();
  }

  /**
   * Called after each rep with the rep's data
   * Returns adaptation action if one is triggered
   */
  processRep(rom, formCorrect, compensations) {
    this.fatigueDetector.addRep(rom);

    if (formCorrect && compensations.length === 0) {
      this.consecutiveGoodReps++;
      this.consecutiveBadReps = 0;
    } else {
      this.consecutiveBadReps++;
      this.consecutiveGoodReps = 0;
    }

    let adaptation = null;

    // Check fatigue
    if (this.fatigueDetector.isFatigued) {
      const newTarget = Math.max(this.fatigueDetector.repROMs.length + 2, this.exercise.reducedReps);
      if (newTarget < this.targetReps) {
        adaptation = {
          type: 'reduce_reps',
          reason: `I noticed your range of motion decreased on the last few reps — let's aim for ${newTarget} reps today`,
          oldTarget: this.targetReps,
          newTarget,
        };
        this.targetReps = newTarget;
        this.currentDifficulty = 'easier';
      }
    }

    // Check compensation patterns - if persistent, suggest easier variant
    if (this.consecutiveBadReps >= 3 && compensations.length > 0 && this.exercise.easierVariant) {
      adaptation = {
        type: 'switch_exercise',
        reason: `I see you're compensating with your ${compensations[0].compensatingJoint} — let's switch to a gentler variant`,
        suggestedExercise: this.exercise.easierVariant,
      };
      this.currentDifficulty = 'easier';
    }

    // Check if user is doing great - suggest progression
    if (this.consecutiveGoodReps >= 5 && !this.fatigueDetector.isFatigued) {
      if (this.currentDifficulty !== 'harder') {
        adaptation = {
          type: 'suggest_harder',
          reason: 'Excellent form! You might be ready for a more challenging variation next session',
        };
        this.currentDifficulty = 'harder';
      }
    }

    if (adaptation) {
      this.adaptations.push({ ...adaptation, repNumber: this.fatigueDetector.repROMs.length, timestamp: Date.now() });
    }

    return adaptation;
  }

  /**
   * Check compensation on every frame (not just per rep)
   */
  checkCompensation(angles) {
    return this.compensationDetector.detect(angles, this.exercise);
  }

  getSessionSummary() {
    return {
      targetReps: this.targetReps,
      difficulty: this.currentDifficulty,
      adaptations: this.adaptations,
      fatigueCurve: this.fatigueDetector.getFatigueCurve(),
      fatigueLevel: this.fatigueDetector.fatigueLevel,
    };
  }

  reset() {
    this.targetReps = this.exercise.standardReps;
    this.currentDifficulty = 'normal';
    this.adaptations = [];
    this.consecutiveGoodReps = 0;
    this.consecutiveBadReps = 0;
    this.fatigueDetector.reset();
    this.compensationDetector.reset();
  }
}

/**
 * Session Manager - orchestrates the full exercise session
 */
export class SessionManager {
  constructor() {
    this.exercises = [];
    this.currentExerciseIndex = 0;
    this.sessionData = {
      startTime: null,
      endTime: null,
      exercises: [],
    };
    this.isRunning = false;
  }

  /**
   * Start a session with selected exercises
   */
  startSession(exerciseIds) {
    this.exercises = exerciseIds;
    this.currentExerciseIndex = 0;
    this.sessionData = {
      startTime: Date.now(),
      endTime: null,
      exercises: [],
    };
    this.isRunning = true;
  }

  getCurrentExerciseId() {
    if (this.currentExerciseIndex >= this.exercises.length) return null;
    return this.exercises[this.currentExerciseIndex];
  }

  /**
   * Record results for current exercise and advance
   */
  completeExercise(results) {
    this.sessionData.exercises.push({
      exerciseId: this.getCurrentExerciseId(),
      ...results,
      completedAt: Date.now(),
    });
    this.currentExerciseIndex++;

    if (this.currentExerciseIndex >= this.exercises.length) {
      this.endSession();
    }
  }

  endSession() {
    this.sessionData.endTime = Date.now();
    this.isRunning = false;
  }

  getProgress() {
    return {
      current: this.currentExerciseIndex + 1,
      total: this.exercises.length,
      percentage: ((this.currentExerciseIndex) / this.exercises.length) * 100,
    };
  }
}
