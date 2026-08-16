import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Container, Paper, Grid, Card, Alert } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TimelineIcon from '@mui/icons-material/Timeline';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { getAllSessions, getProfile, exportSessionsCSV } from '../services/storageService';
import { downloadReport } from '../services/reportService';

export default function Report() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    async function load() {
      setSessions(await getAllSessions());
      setProfile(await getProfile());
    }
    load();
  }, []);

  const latest = sessions.length > 0 ? sessions[sessions.length - 1] : null;

  const chartData = sessions.map((s, i) => {
    const ex = s.exercises?.[0] || {};
    return { session: i + 1, symmetry: ex.symmetryIndex || 0, form: ex.formAccuracy || 0, fatigue: ex.fatigueLevel || 0 };
  });

  const fatigueCurve = latest?.exercises?.[0]?.fatigueCurve || [];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fdfcf6' }}>
      <Box sx={{ px: 4, py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,0,0,0.06)', bgcolor: '#fff' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/dashboard')}>Back</Button>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>Clinical Report</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" startIcon={<DownloadIcon />} disabled={!sessions.length}
            onClick={() => { const csv = exportSessionsCSV(sessions); const b = new Blob([csv], { type: 'text/csv' }); const u = URL.createObjectURL(b); const a = document.createElement('a'); a.href = u; a.download = 'healmotion_data.csv'; a.click(); }}>
            CSV
          </Button>
          <Button variant="contained" startIcon={<DownloadIcon />} disabled={!latest}
            onClick={() => downloadReport(latest, profile)}
            sx={{ background: 'linear-gradient(135deg, #e1894f 0%, #f5b88a 100%)' }}>
            PDF Report
          </Button>
        </Box>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {sessions.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <TimelineIcon sx={{ fontSize: 60, color: '#ccc', mb: 2 }} />
            <Typography variant="h5" color="text.secondary">No sessions yet</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Complete an exercise to see your report</Typography>
            <Button variant="contained" onClick={() => navigate('/session')}
              sx={{ background: 'linear-gradient(135deg, #e1894f 0%, #f5b88a 100%)' }}>Start Session</Button>
          </Box>
        ) : (
          <>
            {/* Latest session cards */}
            {latest && (
              <Paper variant="outlined" sx={{ p: 3, mb: 4, borderColor: 'rgba(225,137,79,0.15)' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  Latest Session — {new Date(latest.savedAt).toLocaleDateString()}
                </Typography>
                <Grid container spacing={2}>
                  {latest.exercises?.map((ex, i) => (
                    <React.Fragment key={i}>
                      {[
                        { label: 'Reps', value: `${ex.repsCompleted}/${ex.targetReps}`, color: '#e1894f' },
                        { label: 'Form', value: `${ex.formAccuracy}%`, color: ex.formAccuracy > 80 ? '#4a9e8e' : '#ca8a04' },
                        { label: 'Symmetry', value: `${ex.symmetryIndex}%`, color: '#4a9e8e' },
                        { label: 'ROM', value: `${ex.avgROM?.toFixed(0) || 0}°`, color: '#e1894f' },
                        { label: 'Fatigue', value: `${ex.fatigueLevel?.toFixed(0) || 0}%`, color: ex.fatigueLevel > 30 ? '#ef5350' : '#4a9e8e' },
                      ].map((item, j) => (
                        <Grid item xs={6} sm={2.4} key={j}>
                          <Card variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                            <Typography variant="caption" color="text.secondary">{item.label}</Typography>
                            <Typography variant="h5" sx={{ fontWeight: 700, color: item.color }}>{item.value}</Typography>
                          </Card>
                        </Grid>
                      ))}
                    </React.Fragment>
                  ))}
                </Grid>
                {latest.exercises?.[0]?.compensationsDetected > 0 && (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    Compensation patterns detected — your body may be adapting around areas of stiffness or pain.
                  </Alert>
                )}
              </Paper>
            )}

            {/* Fatigue curve */}
            {fatigueCurve.length > 2 && (
              <Paper variant="outlined" sx={{ p: 3, mb: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Fatigue Curve</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>ROM per rep — decline indicates fatigue</Typography>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={fatigueCurve}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="rep" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="rom" stroke="#e1894f" strokeWidth={2} dot={{ fill: '#e1894f' }} />
                  </LineChart>
                </ResponsiveContainer>
              </Paper>
            )}

            {/* Progress over time */}
            {chartData.length > 1 && (
              <Paper variant="outlined" sx={{ p: 3, mb: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Progress Over Time</Typography>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="session" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="symmetry" name="Symmetry %" stroke="#4a9e8e" strokeWidth={2} />
                    <Line type="monotone" dataKey="form" name="Form %" stroke="#e1894f" strokeWidth={2} />
                    <Line type="monotone" dataKey="fatigue" name="Fatigue %" stroke="#ef5350" strokeWidth={2} strokeDasharray="5 5" />
                  </LineChart>
                </ResponsiveContainer>
              </Paper>
            )}

            <Box sx={{ p: 2, bgcolor: '#fef9f0', borderRadius: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                🔒 All data stored locally. Reports generated on-device.
              </Typography>
            </Box>
          </>
        )}
      </Container>
    </Box>
  );
}
