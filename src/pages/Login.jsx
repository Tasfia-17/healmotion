import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Paper, Tabs, Tab } from '@mui/material';

export default function Login() {
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple local auth - store in localStorage
    if (tab === 1) {
      // Signup
      localStorage.setItem('healmotion_user', JSON.stringify({ name: form.name, email: form.email }));
    } else {
      // Login
      const saved = localStorage.getItem('healmotion_user');
      if (!saved) {
        localStorage.setItem('healmotion_user', JSON.stringify({ name: 'User', email: form.email }));
      }
    }
    navigate('/dashboard');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(160deg, #fdfcf6 0%, #fef9f0 40%, #fef3c7 100%)',
      }}
    >
      {/* Decorative dots */}
      <Box sx={{ position: 'absolute', top: 60, left: '10%', width: 12, height: 12, borderRadius: '50%', bgcolor: '#fcd34d', opacity: 0.3 }} />
      <Box sx={{ position: 'absolute', top: '30%', right: '8%', width: 16, height: 16, borderRadius: '50%', bgcolor: '#f5b88a', opacity: 0.25 }} />
      <Box sx={{ position: 'absolute', bottom: '20%', left: '15%', width: 10, height: 10, borderRadius: '50%', bgcolor: '#4a9e8e', opacity: 0.2 }} />
      <Box sx={{ position: 'absolute', bottom: 80, right: '20%', width: 8, height: 8, borderRadius: '50%', bgcolor: '#e1894f', opacity: 0.3 }} />

      {/* Decorative background circles */}
      <Box sx={{
        position: 'absolute', top: -100, right: -100,
        width: 350, height: 350, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(225,137,79,0.08) 0%, transparent 70%)',
      }} />
      <Box sx={{
        position: 'absolute', bottom: -80, left: -80,
        width: 300, height: 300, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(74,158,142,0.08) 0%, transparent 70%)',
      }} />

      <Paper
        elevation={0}
        sx={{
          p: { xs: 4, md: 5 },
          width: '100%',
          maxWidth: 420,
          mx: 2,
          borderRadius: 4,
          border: '1px solid rgba(225,137,79,0.12)',
          boxShadow: '0 12px 40px rgba(0,0,0,0.04)',
          position: 'relative',
          zIndex: 1,
          bgcolor: 'rgba(255,255,255,0.95)',
        }}
      >
        {/* Logo */}
        <Typography
          variant="h4"
          sx={{ fontWeight: 700, textAlign: 'center', mb: 0.5, color: '#e1894f' }}
        >
          heal<span style={{ color: '#4a9e8e' }}>motion</span>
        </Typography>
        <Typography variant="body2" sx={{ textAlign: 'center', color: '#545454', mb: 3 }}>
          Your AI physiotherapist awaits
        </Typography>

        {/* Tabs */}
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          variant="fullWidth"
          sx={{
            mb: 3,
            '& .MuiTab-root': { fontWeight: 600 },
            '& .Mui-selected': { color: '#e1894f' },
            '& .MuiTabs-indicator': { bgcolor: '#e1894f' },
          }}
        >
          <Tab label="Sign In" />
          <Tab label="Sign Up" />
        </Tabs>

        <form onSubmit={handleSubmit}>
          {tab === 1 && (
            <TextField
              fullWidth
              label="Full Name"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              sx={{ mb: 2 }}
              variant="outlined"
            />
          )}
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            sx={{ mb: 2 }}
            variant="outlined"
            required
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={form.password}
            onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            sx={{ mb: 3 }}
            variant="outlined"
            required
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{
              py: 1.5,
              background: 'linear-gradient(135deg, #e1894f 0%, #f5b88a 100%)',
              boxShadow: '0 6px 20px rgba(225,137,79,0.25)',
              fontSize: '1rem',
              '&:hover': { background: 'linear-gradient(135deg, #b5613a 0%, #e1894f 100%)' },
            }}
          >
            {tab === 0 ? 'Sign In' : 'Create Account'}
          </Button>
        </form>

        <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 3, color: '#9e9e9e' }}>
          🔒 All data stays on your device. 100% private.
        </Typography>
      </Paper>
    </Box>
  );
}
