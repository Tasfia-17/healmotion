import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Button, Grid, Card, CardContent, CardActions,
  Chip, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Toolbar, Paper, Avatar,
} from '@mui/material';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import ChatIcon from '@mui/icons-material/Chat';
import DescriptionIcon from '@mui/icons-material/Description';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import { EXERCISES } from '../engine/exercises';
import { getWeeklyStats } from '../services/storageService';

const DRAWER_WIDTH = 220;
const NAV_ITEMS = [
  { label: 'Overview', icon: <AnalyticsIcon />, key: 'overview' },
  { label: 'Exercises', icon: <FitnessCenterIcon />, key: 'exercises' },
  { label: 'Stretches', icon: <AccessibilityNewIcon />, key: 'stretches' },
  { label: 'AI Coach', icon: <ChatIcon />, key: 'chat' },
  { label: 'Reports', icon: <DescriptionIcon />, key: 'reports' },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');
  const [stats, setStats] = useState({ streak: 0, totalReps: 0, totalSessions: 0, avgSymmetry: 0 });
  const [user, setUser] = useState({ name: 'User' });

  useEffect(() => {
    const saved = localStorage.getItem('healmotion_user');
    if (saved) setUser(JSON.parse(saved));
    getWeeklyStats().then(setStats);
  }, []);

  const exercises = Object.values(EXERCISES);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            bgcolor: '#fdfcf6',
            borderRight: '1px solid rgba(0,0,0,0.06)',
          },
        }}
      >
        <Toolbar sx={{ px: 2, py: 1.5 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#e1894f' }}>
            heal<span style={{ color: '#4a9e8e' }}>motion</span>
          </Typography>
        </Toolbar>
        <List sx={{ px: 1 }}>
          {NAV_ITEMS.map(item => (
            <ListItem key={item.key} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                selected={activeSection === item.key}
                onClick={() => {
                  if (item.key === 'chat') navigate('/chat');
                  else if (item.key === 'reports') navigate('/report');
                  else setActiveSection(item.key);
                }}
                sx={{
                  borderRadius: 2,
                  '&.Mui-selected': { bgcolor: '#fef3c7', color: '#e1894f' },
                  '&.Mui-selected .MuiListItemIcon-root': { color: '#e1894f' },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: '#795030' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 500, fontSize: '0.9rem' }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        {/* Bottom user section */}
        <Box sx={{ mt: 'auto', p: 2, borderTop: '1px solid rgba(0,0,0,0.06)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: '#e1894f', fontSize: '0.8rem' }}>
              {user.name?.[0] || 'U'}
            </Avatar>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>{user.name}</Typography>
          </Box>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, bgcolor: '#fdfcf6', p: { xs: 2, md: 4 } }}>
        {activeSection === 'overview' && (
          <OverviewSection stats={stats} user={user} navigate={navigate} />
        )}
        {(activeSection === 'exercises' || activeSection === 'stretches') && (
          <ExerciseSection exercises={exercises} navigate={navigate} />
        )}
      </Box>
    </Box>
  );
}

function OverviewSection({ stats, user, navigate }) {
  return (
    <>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
        Hey, {user.name}! 👋
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Ready to keep healing today?
      </Typography>

      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {[
          { label: 'Day Streak', value: stats.streak, icon: <LocalFireDepartmentIcon />, color: '#e1894f' },
          { label: 'Total Reps', value: stats.totalReps, icon: <FitnessCenterIcon />, color: '#4a9e8e' },
          { label: 'Sessions', value: stats.totalSessions, icon: <AnalyticsIcon />, color: '#e1894f' },
          { label: 'Avg Symmetry', value: `${stats.avgSymmetry}%`, icon: <AccessibilityNewIcon />, color: '#4a9e8e' },
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

      {/* Quick Start Banner */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          mb: 4,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #fef9f0 0%, #fef3c7 100%)',
          border: '1px solid rgba(225,137,79,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>🎯 Start a Session</Typography>
          <Typography variant="body2" color="text.secondary">
            AI adapts to your body in real-time
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<PlayArrowIcon />}
          onClick={() => navigate('/session')}
          sx={{
            px: 4, py: 1.3,
            background: 'linear-gradient(135deg, #e1894f 0%, #f5b88a 100%)',
            boxShadow: '0 6px 20px rgba(225,137,79,0.25)',
            '&:hover': { background: 'linear-gradient(135deg, #b5613a 0%, #e1894f 100%)' },
          }}
        >
          Start Now
        </Button>
      </Paper>

      {/* Quick exercise picks */}
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Recommended</Typography>
      <Grid container spacing={2}>
        {Object.values(EXERCISES).slice(0, 3).map(ex => (
          <Grid item xs={12} sm={4} key={ex.id}>
            <Card variant="outlined" sx={{ border: '1px solid rgba(0,0,0,0.06)' }}>
              <CardContent>
                <Typography variant="h5" component="span">{ex.icon}</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600, mt: 1 }}>{ex.name}</Typography>
                <Typography variant="body2" color="text.secondary">{ex.description}</Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  onClick={() => navigate(`/session/${ex.id}`)}
                  sx={{ color: '#e1894f', fontWeight: 600 }}
                >
                  Start →
                </Button>
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
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Choose an exercise — AI will guide your form in real-time
      </Typography>
      <Grid container spacing={2}>
        {exercises.map(ex => (
          <Grid item xs={12} sm={6} md={4} key={ex.id}>
            <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
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
                <Button
                  fullWidth variant="outlined" startIcon={<PlayArrowIcon />}
                  onClick={() => navigate(`/session/${ex.id}`)}
                  sx={{ borderColor: '#e1894f', color: '#e1894f', '&:hover': { bgcolor: '#e1894f', color: '#fff' } }}
                >
                  Start
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
}
