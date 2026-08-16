import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Grid, Container, Paper, Chip } from '@mui/material';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import { HeroIllustration, TrackingArt, BrainArt, ShieldArt, ChartArt, WaveBg } from '../assets/SvgArt';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fdfcf6', overflow: 'hidden' }}>
      {/* Navbar */}
      <Box sx={{
        px: { xs: 3, md: 8 }, py: 2.5,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        position: 'relative', zIndex: 10,
      }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#e1894f', letterSpacing: '-0.5px', fontSize: '1.5rem' }}>
          heal<span style={{ color: '#4a9e8e' }}>motion</span>
        </Typography>
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
          <Chip label="100% Private" size="small" sx={{ bgcolor: '#e8f5e9', color: '#2e7d32', fontWeight: 500, display: { xs: 'none', sm: 'flex' } }} />
          <Button
            variant="outlined"
            onClick={() => navigate('/login')}
            sx={{ borderColor: '#e1894f', borderWidth: 2, color: '#e1894f', fontWeight: 600, '&:hover': { bgcolor: '#e1894f', color: '#fff', borderWidth: 2 } }}
          >
            Sign In
          </Button>
        </Box>
      </Box>

      {/* Hero Section - Flexy style: bold text left, big art right */}
      <Container maxWidth="xl" sx={{ px: { xs: 3, md: 8 } }}>
        <Grid container alignItems="center" sx={{ minHeight: { md: '80vh' }, pt: { xs: 4, md: 0 } }}>
          <Grid item xs={12} md={5}>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.5rem', sm: '3rem', md: '3.8rem' },
                fontWeight: 700,
                lineHeight: 1.1,
                color: '#1a1a1a',
                mb: 2.5,
              }}
            >
              Rehab that{' '}
              <Box component="span" sx={{ color: '#e1894f' }}>watches</Box>,{' '}
              <Box component="span" sx={{ color: '#4a9e8e' }}>adapts</Box>,{' '}
              and heals.
            </Typography>
            <Typography
              variant="h6"
              sx={{ color: '#545454', fontWeight: 400, lineHeight: 1.6, mb: 4, maxWidth: 420, fontSize: '1.05rem' }}
            >
              AI-powered physiotherapy that detects compensation patterns,
              tracks your fatigue, and adjusts exercises in real time.
              All from your webcam. All on your device.
            </Typography>
            <Button
              variant="outlined"
              onClick={() => navigate('/login')}
              endIcon={<ArrowForwardIosRoundedIcon />}
              sx={{
                py: 1.3, px: 4,
                borderColor: '#e1894f', borderWidth: 2,
                color: '#1a1a1a', fontWeight: 700, fontSize: '1rem',
                '&:hover': { backgroundColor: '#e1894f', color: '#fff', borderWidth: 2 },
              }}
            >
              Get Started
            </Button>
          </Grid>
          <Grid item xs={12} md={7}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: { xs: 5, md: 0 } }}>
              <HeroIllustration />
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Wave transition */}
      <WaveBg color="#fef3c7" />

      {/* Features Section */}
      <Box sx={{ bgcolor: '#fef3c7', py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Typography variant="h3" sx={{ fontWeight: 700, textAlign: 'center', mb: 1.5, fontSize: { xs: '1.8rem', md: '2.3rem' } }}>
            What makes it different
          </Typography>
          <Typography variant="body1" sx={{ textAlign: 'center', color: '#545454', mb: 6, maxWidth: 500, mx: 'auto' }}>
            Not just another pose app. Clinical intelligence built for real recovery.
          </Typography>

          <Grid container spacing={4}>
            {[
              {
                art: <TrackingArt />,
                title: 'Real-Time Joint Tracking',
                desc: '33 body landmarks tracked at video framerate. Joint angles computed in real time with clinical-grade accuracy.',
              },
              {
                art: <BrainArt />,
                title: 'Compensation Detection',
                desc: 'Detects when you lean, shift, or avoid a movement due to pain. Adapts your exercise automatically.',
              },
              {
                art: <ChartArt />,
                title: 'Fatigue Intelligence',
                desc: 'Monitors ROM decline over reps. When fatigue exceeds 15%, reduces workload to prevent injury.',
              },
              {
                art: <ShieldArt />,
                title: 'Fully Private',
                desc: 'Zero data leaves your browser. No server. No account required. Your health data stays yours.',
              },
            ].map((feat, i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3, textAlign: 'center', height: '100%',
                    bgcolor: '#fff', border: '1px solid rgba(0,0,0,0.06)',
                    borderRadius: 3,
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 30px rgba(0,0,0,0.06)' },
                  }}
                >
                  <Box sx={{ mb: 2 }}>{feat.art}</Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, fontSize: '1rem' }}>{feat.title}</Typography>
                  <Typography variant="body2" sx={{ color: '#545454', lineHeight: 1.6 }}>{feat.desc}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <WaveBg color="#fdfcf6" flip />

      {/* How it works */}
      <Box sx={{ py: { xs: 8, md: 12 } }}>
        <Container maxWidth="md">
          <Typography variant="h3" sx={{ fontWeight: 700, textAlign: 'center', mb: 6, fontSize: { xs: '1.8rem', md: '2.3rem' } }}>
            How it works
          </Typography>
          <Grid container spacing={4}>
            {[
              { step: '01', title: 'Open your webcam', desc: 'No app to install. Works in Chrome, Edge, or Firefox on any device with a camera.', color: '#e1894f' },
              { step: '02', title: 'Choose your exercise', desc: 'Pick from our clinically-designed library targeting shoulders, knees, hips, neck, or full body.', color: '#4a9e8e' },
              { step: '03', title: 'Move and get feedback', desc: 'AI tracks your joints, counts reps, detects compensation, and adjusts difficulty live.', color: '#e1894f' },
              { step: '04', title: 'Export your report', desc: 'Download a clinical PDF with ROM, symmetry scores, and insights for your doctor.', color: '#4a9e8e' },
            ].map((item, i) => (
              <Grid item xs={12} sm={6} key={i}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                  <Box sx={{
                    minWidth: 48, height: 48, borderRadius: '50%',
                    bgcolor: item.color, color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: '1rem',
                  }}>
                    {item.step}
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, fontSize: '1rem' }}>{item.title}</Typography>
                    <Typography variant="body2" sx={{ color: '#545454', lineHeight: 1.6 }}>{item.desc}</Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ py: { xs: 6, md: 10 }, textAlign: 'center' }}>
        <Container maxWidth="sm">
          <Box sx={{
            p: { xs: 4, md: 6 }, borderRadius: 4,
            background: 'linear-gradient(135deg, #e1894f 0%, #f5b88a 50%, #fcd34d 100%)',
            boxShadow: '0 20px 50px rgba(225,137,79,0.2)',
          }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#fff', mb: 1.5 }}>
              Start healing today.
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', mb: 3 }}>
              Free. No account needed. Just you and your webcam.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/login')}
              sx={{
                px: 5, py: 1.5,
                bgcolor: '#fff', color: '#e1894f', fontWeight: 700, fontSize: '1rem',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                '&:hover': { bgcolor: '#fdfcf6' },
              }}
            >
              Get Started Free
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ py: 3, textAlign: 'center', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
        <Typography variant="body2" sx={{ color: '#9e9e9e' }}>
          healmotion · CS Girlies Hackathon 2026 · Technology for Wellness
        </Typography>
      </Box>
    </Box>
  );
}
