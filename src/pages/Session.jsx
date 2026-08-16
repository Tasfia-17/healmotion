import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Typography, Button, Chip, LinearProgress, Paper, CircularProgress, Alert } from '@mui/material';
import StopIcon from '@mui/icons-material/Stop';
import VideocamIcon from '@mui/icons-material/Videocam';
import { initPoseLandmarker, detectPose, drawLandmarks, destroyPoseLandmarker } from '../services/poseService';
import { computeAllJointAngles, computeSymmetryIndex, MovementAnalyzer } from '../engine/biomechanics';
import { RepCounter, AdaptiveDifficulty } from '../engine/sessionEngine';
import { getExercise } from '../engine/exercises';
import { saveSession } from '../services/storageService';

export default function Session() {
  const navigate = useNavigate();
  const { exerciseId } = useParams();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(null);
  const [repCount, setRepCount] = useState(0);
  const [targetReps, setTargetReps] = useState(10);
  const [feedback, setFeedback] = useState(null);
  const [compensations, setCompensations] = useState([]);
  const [adaptation, setAdaptation] = useState(null);
  const [symmetryIndex, setSymmetryIndex] = useState(null);
  const [jerkMetric, setJerkMetric] = useState(null);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [sessionResults, setSessionResults] = useState(null);

  const repCounterRef = useRef(null);
  const adaptiveRef = useRef(null);
  const movementRef = useRef(new MovementAnalyzer(15));
  const formViolationFrames = useRef(0);
  const totalFrames = useRef(0);
  const sessionDataRef = useRef({ startTime: null, roms: [], symmetries: [], compensationCount: 0 });

  useEffect(() => {
    const id = exerciseId || 'shoulder-flexion';
    const exercise = getExercise(id);
    if (exercise) {
      setCurrentExercise(exercise);
      setTargetReps(exercise.standardReps);
      repCounterRef.current = new RepCounter(exercise);
      adaptiveRef.current = new AdaptiveDifficulty(exercise);
    }
  }, [exerciseId]);

  useEffect(() => {
    let stream = null;
    async function setup() {
      try {
        setLoading(true);
        await initPoseLandmarker();
        stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480, facingMode: 'user' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setCameraReady(true);
        }
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to access camera');
        setLoading(false);
      }
    }
    setup();
    return () => {
      if (stream) stream.getTracks().forEach(t => t.stop());
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      destroyPoseLandmarker();
    };
  }, []);

  const completeSession = useCallback(async () => {
    setIsRunning(false);
    setSessionComplete(true);
    const data = sessionDataRef.current;
    const avgROM = data.roms.length > 0 ? data.roms.reduce((s, v) => s + v, 0) / data.roms.length : 0;
    const avgSym = data.symmetries.length > 0 ? data.symmetries.reduce((s, v) => s + v, 0) / data.symmetries.length : 0;
    const adaptive = adaptiveRef.current?.getSessionSummary();
    const results = {
      exerciseId: currentExercise?.id,
      repsCompleted: repCounterRef.current?.repCount || 0,
      targetReps,
      avgROM,
      symmetryIndex: Math.round(avgSym),
      fatigueLevel: adaptive?.fatigueLevel || 0,
      fatigueCurve: adaptive?.fatigueCurve || [],
      compensationsDetected: data.compensationCount,
      adaptations: adaptive?.adaptations || [],
      formAccuracy: totalFrames.current > 0 ? Math.round(((totalFrames.current - formViolationFrames.current) / totalFrames.current) * 100) : 100,
    };
    setSessionResults(results);
    await saveSession({ startTime: data.startTime, endTime: Date.now(), exercises: [results] });
  }, [currentExercise, targetReps]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const processFrame = useCallback(() => {
    if (!isRunning || !videoRef.current || !canvasRef.current || !currentExercise) {
      animFrameRef.current = requestAnimationFrame(processFrame);
      return;
    }
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const landmarks = detectPose(video);

    if (landmarks) {
      drawLandmarks(ctx, landmarks, canvas.width, canvas.height);
      const angles = computeAllJointAngles(landmarks);
      if (!angles) { animFrameRef.current = requestAnimationFrame(processFrame); return; }

      totalFrames.current++;
      movementRef.current.addFrame(angles, performance.now());
      const jerk = movementRef.current.getJerkMetric();
      if (jerk != null) setJerkMetric(Math.min(100, jerk));

      const sym = computeSymmetryIndex(angles);
      if (sym != null) { setSymmetryIndex(sym); sessionDataRef.current.symmetries.push(sym); }

      let formCorrect = true;
      for (const rule of currentExercise.formRules) {
        const angle = angles[rule.joint];
        if (angle != null && (angle < rule.range[0] || angle > rule.range[1])) {
          formCorrect = false;
          formViolationFrames.current++;
          setFeedback({ message: rule.message });
          break;
        }
      }
      if (formCorrect) setFeedback(null);

      if (adaptiveRef.current) {
        const comps = adaptiveRef.current.checkCompensation(angles);
        setCompensations(comps.length > 0 ? comps : []);
        if (comps.length > 0) sessionDataRef.current.compensationCount += comps.length;
      }

      if (repCounterRef.current) {
        const { repCompleted, rom } = repCounterRef.current.processFrame(angles);
        if (repCompleted) {
          const newCount = repCounterRef.current.repCount;
          setRepCount(newCount);
          sessionDataRef.current.roms.push(rom);
          if (adaptiveRef.current) {
            const adapt = adaptiveRef.current.processRep(rom, formCorrect, compensations);
            if (adapt) {
              setAdaptation(adapt);
              if (adapt.type === 'reduce_reps') setTargetReps(adapt.newTarget);
              setTimeout(() => setAdaptation(null), 5000);
            }
          }
          if (newCount >= targetReps) completeSession();
        }
      }
    } else {
      if (canvasRef.current) canvasRef.current.getContext('2d').clearRect(0, 0, 640, 480);
    }
    animFrameRef.current = requestAnimationFrame(processFrame);
  }, [isRunning, currentExercise, compensations, targetReps, completeSession]);

  useEffect(() => {
    if (cameraReady) animFrameRef.current = requestAnimationFrame(processFrame);
    return () => { if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current); };
  }, [cameraReady, processFrame]);

  const startExercise = () => {
    sessionDataRef.current = { startTime: Date.now(), roms: [], symmetries: [], compensationCount: 0 };
    setIsRunning(true);
    setRepCount(0);
    setFeedback(null);
    setCompensations([]);
    setAdaptation(null);
    movementRef.current.reset();
    if (repCounterRef.current) repCounterRef.current.reset();
    if (adaptiveRef.current) adaptiveRef.current.reset();
    formViolationFrames.current = 0;
    totalFrames.current = 0;
  };

  if (loading) return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', bgcolor: '#fdfcf6' }}>
      <CircularProgress sx={{ color: '#e1894f', mb: 2 }} />
      <Typography variant="h6" sx={{ fontWeight: 600 }}>Loading AI...</Typography>
      <Typography variant="body2" color="text.secondary">Preparing pose detection</Typography>
    </Box>
  );

  if (error) return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', bgcolor: '#fdfcf6', p: 3 }}>
      <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      <Button variant="outlined" onClick={() => navigate('/dashboard')}>Back</Button>
    </Box>
  );

  if (sessionComplete && sessionResults) return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fdfcf6', py: 6, px: 3 }}>
      <Box sx={{ maxWidth: 450, mx: 'auto', textAlign: 'center' }}>
        <Typography variant="h2" sx={{ mb: 1 }}>🎉</Typography>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, color: '#e1894f' }}>Great Session!</Typography>
        <Paper variant="outlined" sx={{ p: 3, mb: 3, textAlign: 'left', borderColor: 'rgba(225,137,79,0.2)' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>{currentExercise?.icon} {currentExercise?.name}</Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <StatBox label="Reps" value={`${sessionResults.repsCompleted}/${sessionResults.targetReps}`} color="#e1894f" />
            <StatBox label="Form" value={`${sessionResults.formAccuracy}%`} color={sessionResults.formAccuracy > 80 ? '#4a9e8e' : '#ca8a04'} />
            <StatBox label="Symmetry" value={`${sessionResults.symmetryIndex}%`} color="#4a9e8e" />
            <StatBox label="Fatigue" value={`${sessionResults.fatigueLevel.toFixed(0)}%`} color={sessionResults.fatigueLevel > 30 ? '#ef5350' : '#4a9e8e'} />
          </Box>
          {sessionResults.adaptations?.length > 0 && (
            <Box sx={{ mt: 2, p: 1.5, bgcolor: '#fef9f0', borderRadius: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>🧠 AI Adaptations:</Typography>
              {sessionResults.adaptations.map((a, i) => (
                <Typography key={i} variant="body2" color="text.secondary">• {a.reason}</Typography>
              ))}
            </Box>
          )}
        </Paper>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button variant="outlined" onClick={() => navigate('/report')}>View Report</Button>
          <Button variant="contained" onClick={() => navigate('/dashboard')}
            sx={{ background: 'linear-gradient(135deg, #e1894f 0%, #f5b88a 100%)' }}>Done</Button>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#111' }}>
      {/* Header */}
      <Box sx={{ px: 2, py: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: 'rgba(0,0,0,0.9)' }}>
        <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>
          {currentExercise?.icon} {currentExercise?.name}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Chip label={`${repCount}/${targetReps}`} sx={{ bgcolor: '#e1894f', color: '#fff', fontWeight: 700, fontSize: '1rem' }} />
          <Button size="small" startIcon={<StopIcon />} onClick={completeSession} sx={{ color: '#fff' }}>End</Button>
        </Box>
      </Box>
      <LinearProgress variant="determinate" value={(repCount / targetReps) * 100}
        sx={{ height: 4, bgcolor: 'rgba(255,255,255,0.1)', '& .MuiLinearProgress-bar': { bgcolor: '#e1894f' } }} />

      {/* Camera area */}
      <Box sx={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <video ref={videoRef} playsInline muted
          style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} />
        <canvas ref={canvasRef} width={640} height={480}
          style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} />

        {!isRunning && (
          <Box sx={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', bgcolor: 'rgba(0,0,0,0.6)', zIndex: 10 }}>
            <VideocamIcon sx={{ fontSize: 50, color: '#fff', mb: 2 }} />
            <Typography variant="h5" sx={{ color: '#fff', fontWeight: 600, mb: 1 }}>Position yourself in frame</Typography>
            <Button variant="contained" size="large" onClick={startExercise}
              sx={{ mt: 2, px: 5, background: 'linear-gradient(135deg, #e1894f 0%, #f5b88a 100%)' }}>
              Begin Exercise
            </Button>
          </Box>
        )}

        {/* Feedback overlays */}
        {isRunning && (
          <Box sx={{ position: 'absolute', bottom: 12, left: 12, right: 12, zIndex: 5 }}>
            {feedback && (
              <Paper sx={{ p: 1.5, mb: 1, bgcolor: 'rgba(252,211,77,0.95)', borderRadius: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>💡 {feedback.message}</Typography>
              </Paper>
            )}
            {compensations.length > 0 && (
              <Paper sx={{ p: 1.5, mb: 1, bgcolor: 'rgba(239,83,80,0.9)', borderRadius: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#fff' }}>⚠️ {compensations[0].message}</Typography>
              </Paper>
            )}
            {adaptation && (
              <Paper sx={{ p: 1.5, mb: 1, bgcolor: 'rgba(74,158,142,0.9)', borderRadius: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#fff' }}>🧠 {adaptation.reason}</Typography>
              </Paper>
            )}
            <Box sx={{ display: 'flex', gap: 1 }}>
              {symmetryIndex != null && <Chip size="small" label={`Sym: ${symmetryIndex}%`} sx={{ bgcolor: 'rgba(255,255,255,0.85)', fontWeight: 600 }} />}
              {jerkMetric != null && <Chip size="small" label={`Smooth: ${Math.max(0, 100 - Math.round(jerkMetric))}%`} sx={{ bgcolor: 'rgba(255,255,255,0.85)', fontWeight: 600 }} />}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}

function StatBox({ label, value, color }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary">{label}</Typography>
      <Typography variant="h5" sx={{ fontWeight: 700, color }}>{value}</Typography>
    </Box>
  );
}
