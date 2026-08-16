import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Button, Grid, Card, CardContent, CardActions,
  Chip, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Toolbar, Paper, Avatar, TextField, Slider, IconButton,
} from '@mui/material';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import ChatIcon from '@mui/icons-material/Chat';
import DescriptionIcon from '@mui/icons-material/Description';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';
import EditNoteIcon from '@mui/icons-material/EditNote';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import LogoutIcon from '@mui/icons-material/Logout';
import { EXERCISES } from '../engine/exercises';
import { getWeeklyStats } from '../services/storageService';

const DRAWER_WIDTH = 230;
const NAV_ITEMS = [
  { label: 'Overview', icon: <AnalyticsIcon />, key: 'overview' },
  { label: 'Exercises', icon: <FitnessCenterIcon />, key: 'exercises' },
  { label: 'Stretches', icon: <SelfImprovementIcon />, key: 'stretches' },
  { label: 'Pain Journal', icon: <EditNoteIcon />, key: 'journal' },
  { label: 'AI Coach', icon: <ChatIcon />, key: 'chat' },
  { label: 'Reports', icon: <DescriptionIcon />, key: 'reports' },
];

const DAILY_TIPS = [
  "Gentle movement in the morning helps reduce stiffness. Even 2 minutes counts.",
  "Consistency beats intensity. Short daily sessions outperform long weekly ones.",
  "If pain increases during an exercise, stop and try the easier variant.",
  "Track your symmetry score over time. Small improvements are real progress.",
  "Hydration matters for joint health. Drink water before your session.",
  "Listen to your body. Compensation patterns mean it's time to rest or adapt.",
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');
  const [stats, setStats] = useState({ streak: 0, totalReps: 0, totalSessions: 0, avgSymmetry: 0 });
  const [user, setUser] = useState({ name: 'User' });
  const [painEntry, setPainEntry] = useState({ level: 3, note: '' });
  const [painLog, setPainLog] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('healmotion_user');
    if (saved) setUser(JSON.parse(saved));
    getWeeklyStats().then(setStats);
    const log = JSON.parse(localStorage.getItem('healmotion_painlog') || '[]');
    setPainLog(log);
  }, []);

  const savePainEntry = () => {
    const entry = { ...painEntry, date: new Date().toLocaleDateString(), timestamp: Date.now() };
    const updated = [...painLog, entry];
    setPainLog(updated);
    localStorage.setItem('healmotion_painlog', JSON.stringify(updated));
    setPainEntry({ level: 3, note: '' });
  };

  const todayTip = DAILY_TIPS[new Date().getDay() % DAILY_TIPS.length];
  const exercises = Object.values(EXERCISES);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH, flexShrink: 0,
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH, bgcolor: '#fdfcf6', borderRight: '1px solid rgba(0,0,0,0.06)' },
        }}
      >
        <Toolbar sx={{ px: 2.5, py: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#e1894f', fontSize: '1.2rem' }}>
            heal<span style={{ color: '#4a9e8e' }}>motion</span>
          </Typography>
        </Toolbar>
        <List sx={{ px: 1.5 }}>
          {NAV_ITEMS.map(item => (
            <ListItem key={item.key} disablePadding sx={{ mb: 0.3 }}>
              <ListItemButton
                selected={activeSection === item.key}
                onClick={() => {
                  if (item.key === 'chat') navigate('/chat');
                  else if (item.key === 'reports') navigate('/report');
                  else setActiveSection(item.key);
                }}
                sx={{
                  borderRadius: 2, py: 1.2,
                  '&.Mui-selected': { bgcolor: '#fef3c7', color: '#e1894f' },
                  '&.Mui-selected .MuiListItemIcon-root': { color: '#e1894f' },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: '#795030' }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 500, fontSize: '0.88rem' }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Box sx={{ mt: 'auto', p: 2, borderTop: '1px solid rgba(0,0,0,0.06)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Avatar sx={{ width: 34, height: 34, bgcolor: '#e1894f', fontSize: '0.85rem' }}>{user.name?.[0] || 'U'}</Avatar>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.82rem' }}>{user.name}</Typography>
              <Typography variant="caption" sx={{ color: '#9e9e9e' }}>Free Plan</Typography>
            </Box>
          </Box>
          <Button size="small" startIcon={<LogoutIcon />} onClick={() => { localStorage.removeItem('healmotion_user'); navigate('/'); }}
            sx={{ color: '#9e9e9e', fontSize: '0.75rem', mt: 0.5 }}>Sign Out</Button>
        </Box>
      </Drawer>

      {/* Main */}
      <Box component="main" sx={{ flexGrow: 1, bgcolor: '#fdfcf6', p: { xs: 2, md: 4 }, overflow: 'auto' }}>
        {activeSection === 'overview' && <OverviewSection stats={stats} user={user} navigate={navigate} todayTip={todayTip} />}
        {(activeSection === 'exercises' || activeSection === 'stretches') && <ExerciseSection exercises={exercises} navigate={navigate} />}
        {activeSection === 'journal' && <JournalSection painEntry={painEntry} setPainEntry={setPainEntry} painLog={painLog} savePainEntry={savePainEntry} />}
      </Box>
    </Box>
  );
}

function OverviewSection({ stats, user, navigate, todayTip }) {
  return (
    <>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>Hey, {user.name}! 👋</Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>Let's keep the progress going.</Typography>

      {/* Daily tip */}
      <Paper elevation={0} sx={{ p: 2.5, mb: 3, bgcolor: '#f0faf7', border: '1px solid rgba(74,158,142,0.15)', borderRadius: 2, display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
        <TipsAndUpdatesIcon sx={{ color: '#4a9e8e', mt: 0.3 }} />
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 600, color: '#2d7566' }}>Daily Tip</Typography>
          <Typography variant="body2" sx={{ color: '#545454' }}>{todayTip}</Typography>
        </Box>
      </Paper>

      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Day Streak', value: stats.streak, icon: <LocalFireDepartmentIcon />, color: '#e1894f' },
          { label: 'Total Reps', value: stats.totalReps, icon: <FitnessCenterIcon />, color: '#4a9e8e' },
          { label: 'Sessions', value: stats.totalSessions, icon: <AnalyticsIcon />, color: '#e1894f' },
          { label: 'Symmetry', value: `${stats.avgSymmetry}%`, icon: <AccessibilityNewIcon />, color: '#4a9e8e' },
        ].map((s, i) => (
          <Grid item xs={6} sm={3} key={i}>
            <Card variant="outlined" sx={{ textAlign: 'center', py: 2, border: '1px solid rgba(0,0,0,0.06)' }}>
              <Box sx={{ color: s.color, mb: 0.5 }}>{s.icon}</Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: s.color }}>{s.value}</Typography>
              <Typography variant="caption" color="text.secondary">{s.label}</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Quick start */}
      <Paper elevation={0} sx={{
        p: 4, mb: 4, borderRadius: 3,
        background: 'linear-gradient(135deg, #fef9f0 0%, #fef3c7 100%)',
        border: '1px solid rgba(225,137,79,0.15)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2,
      }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>🎯 Start a Session</Typography>
          <Typography variant="body2" color="text.secondary">AI adapts to your body in real time</Typography>
        </Box>
        <Button variant="contained" startIcon={<PlayArrowIcon />} onClick={() => navigate('/session')}
          sx={{ px: 4, py: 1.3, background: 'linear-gradient(135deg, #e1894f 0%, #f5b88a 100%)', boxShadow: '0 6px 20px rgba(225,137,79,0.25)', '&:hover': { background: 'linear-gradient(135deg, #b5613a 0%, #e1894f 100%)' } }}>
          Start Now
        </Button>
      </Paper>

      {/* Quick exercises */}
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Recommended for You</Typography>
      <Grid container spacing={2}>
        {Object.values(EXERCISES).slice(0, 3).map(ex => (
          <Grid item xs={12} sm={4} key={ex.id}>
            <Card variant="outlined" sx={{ border: '1px solid rgba(0,0,0,0.06)' }}>
              <CardContent>
                <Typography variant="h5" component="span">{ex.icon}</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600, mt: 1 }}>{ex.name}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{ex.description}</Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => navigate(`/session/${ex.id}`)} sx={{ color: '#e1894f', fontWeight: 600 }}>Start →</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
}

function ExerciseSection({ exercises, navigate }) {
  return (
    <>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>Exercise Library</Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>Choose an exercise. AI guides your form in real time.</Typography>
      <Grid container spacing={2}>
        {exercises.map(ex => (
          <Grid item xs={12} sm={6} md={4} key={ex.id}>
            <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column', border: '1px solid rgba(0,0,0,0.06)' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Typography variant="h5">{ex.icon}</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>{ex.name}</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>{ex.description}</Typography>
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                  <Chip label={ex.bodyArea} size="small" sx={{ bgcolor: '#fef3c7', fontSize: '0.7rem' }} />
                  <Chip label={`${ex.standardReps} reps`} size="small" variant="outlined" sx={{ fontSize: '0.7rem' }} />
                </Box>
              </CardContent>
              <CardActions sx={{ px: 2, pb: 2 }}>
                <Button fullWidth variant="outlined" startIcon={<PlayArrowIcon />} onClick={() => navigate(`/session/${ex.id}`)}
                  sx={{ borderColor: '#e1894f', color: '#e1894f', '&:hover': { bgcolor: '#e1894f', color: '#fff' } }}>Start</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
}

function JournalSection({ painEntry, setPainEntry, painLog, savePainEntry }) {
  return (
    <>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>Pain Journal</Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>Track how you feel before and after sessions. Helps identify patterns.</Typography>

      <Paper elevation={0} sx={{ p: 3, mb: 4, border: '1px solid rgba(0,0,0,0.08)', borderRadius: 3 }}>
        <Typography variant="body1" sx={{ fontWeight: 600, mb: 2 }}>How are you feeling right now?</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Pain level (0 = none, 10 = severe)</Typography>
        <Slider
          value={painEntry.level} onChange={(_, v) => setPainEntry(p => ({ ...p, level: v }))}
          min={0} max={10} marks={[{ value: 0, label: '0' }, { value: 5, label: '5' }, { value: 10, label: '10' }]}
          sx={{ color: painEntry.level > 6 ? '#ef5350' : painEntry.level > 3 ? '#fcd34d' : '#4a9e8e', mb: 2, maxWidth: 400 }}
        />
        <TextField
          fullWidth multiline rows={2} placeholder="Any notes? (e.g., stiff left shoulder this morning)"
          value={painEntry.note} onChange={e => setPainEntry(p => ({ ...p, note: e.target.value }))}
          sx={{ mb: 2 }}
        />
        <Button variant="contained" onClick={savePainEntry}
          sx={{ background: 'linear-gradient(135deg, #e1894f 0%, #f5b88a 100%)' }}>
          Save Entry
        </Button>
      </Paper>

      {painLog.length > 0 && (
        <>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Recent Entries</Typography>
          {painLog.slice(-5).reverse().map((entry, i) => (
            <Paper key={i} variant="outlined" sx={{ p: 2, mb: 1, borderColor: 'rgba(0,0,0,0.06)' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>{entry.date}</Typography>
                  {entry.note && <Typography variant="body2" color="text.secondary">{entry.note}</Typography>}
                </Box>
                <Chip
                  label={`Pain: ${entry.level}/10`}
                  size="small"
                  sx={{ bgcolor: entry.level > 6 ? '#ffebee' : entry.level > 3 ? '#fff8e1' : '#e8f5e9', fontWeight: 600 }}
                />
              </Box>
            </Paper>
          ))}
        </>
      )}
    </>
  );
}
