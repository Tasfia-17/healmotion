import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Container, Grid } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { HeroArt, AiBrainArt, PrivacyArt, HeartbeatArt, PoseArt, WaveDecoration, FloatingDots } from '../assets/SvgArt';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fdfcf6', overflow: 'hidden' }}>
      {/* Navbar - minimal */}
      <Box sx={{ px: { xs: 3, md: 6 }, py: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#e1894f', letterSpacing: '-0.5px' }}>
          heal<span style={{ color: '#4a9e8e' }}>motion</span>
        </Typography>
        <Button
          variant="outlined"
          onClick={() => navigate('/login')}
          sx={{ borderColor: '#e1894f', color: '#e1894f', '&:hover': { bgcolor: '#e1894f', color: '#fff' } }}
        >
          Sign In
        </Button>
      </Box>

      {/* Hero Section - art heavy */}
      <Box sx={{ position: 'relative', pt: { xs: 4, md: 8 }, pb: 0 }}>
        <FloatingDots />
        <Container maxWidth="lg">
          <Grid container alignItems="center" spacing={4}>
            <Grid item xs={12} md={5}>
              <Box sx={{ position: 'relative', zIndex: 2 }}>
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: '2.2rem', md: '3.4rem' },
                    lineHeight: 1.15,
                    mb: 2,
                    background: 'linear-gradient(135deg, #e1894f 0%, #b5613a 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Move. Heal. Thrive.
                </Typography>
                <Typography variant="body1" sx={{ color: '#545454', mb: 4, fontSize: '1.05rem', maxWidth: 380 }}>
                  AI-powered rehabilitation that watches, adapts, and heals with you.
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => navigate('/login')}
                  sx={{
                    px: 5, py: 1.5,
                    background: 'linear-gradient(135deg, #e1894f 0%, #f5b88a 100%)',
                    boxShadow: '0 8px 25px rgba(225,137,79,0.3)',
                    fontSize: '1.05rem',
                    '&:hover': { background: 'linear-gradient(135deg, #b5613a 0%, #e1894f 100%)' },
                  }}
                >
                  Get Started
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={7}>
              <Box sx={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
                {/* Large gradient background blob behind art */}
                <Box
                  sx={{
                    position: 'absolute',
                    width: '110%',
                    height: '110%',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(252,211,77,0.15) 0%, rgba(225,137,79,0.05) 70%, transparent 100%)',
                    top: '-5%',
                    left: '-5%',
                  }}
                />
                <HeroArt width={420} height={420} />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Wave transition */}
      <WaveDecoration color="#fef9f0" />

      {/* Features - icon cards, minimal text */}
      <Box sx={{ bgcolor: '#fef9f0', py: { xs: 6, md: 10 }, position: 'relative' }}>
        <Container maxWidth="md">
          <Grid container spacing={4} justifyContent="center">
            {[
              { art: <PoseArt size={70} />, label: 'Real-Time Pose AI' },
              { art: <AiBrainArt size={70} />, label: 'Smart Adaptation' },
              { art: <HeartbeatArt size={70} />, label: 'Fatigue Detection' },
              { art: <PrivacyArt size={70} />, label: '100% Private' },
            ].map((item, idx) => (
              <Grid item xs={6} sm={3} key={idx}>
                <Box sx={{ textAlign: 'center' }}>
                  <Box sx={{
                    display: 'inline-flex',
                    p: 2,
                    borderRadius: '50%',
                    bgcolor: '#fff',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                    mb: 1.5,
                  }}>
                    {item.art}
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                    {item.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <WaveDecoration color="#fdfcf6" flip />

      {/* Visual CTA */}
      <Box sx={{ py: { xs: 6, md: 10 }, textAlign: 'center', position: 'relative' }}>
        <FloatingDots />
        <Container maxWidth="sm">
          <Box
            sx={{
              p: 5,
              borderRadius: 4,
              background: 'linear-gradient(135deg, rgba(252,211,77,0.12) 0%, rgba(74,158,142,0.08) 100%)',
              border: '1px solid rgba(225,137,79,0.15)',
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: '#1a1a1a' }}>
              Your recovery, reimagined.
            </Typography>
            <Typography variant="body2" sx={{ color: '#545454', mb: 3 }}>
              No downloads. No accounts required. Just open and heal.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/login')}
              sx={{
                background: 'linear-gradient(135deg, #4a9e8e 0%, #7bcfbd 100%)',
                px: 4, py: 1.2,
                '&:hover': { background: 'linear-gradient(135deg, #2d7566 0%, #4a9e8e 100%)' },
              }}
            >
              Begin Healing →
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ py: 3, textAlign: 'center', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
        <Typography variant="caption" color="text.secondary">
          healmotion • built with 💛 • CS Girlies Hackathon 2026
        </Typography>
      </Box>
    </Box>
  );
}
