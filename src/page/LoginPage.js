import React, { useEffect, useState } from 'react';
import { Container, Grid, FormControl, Button, TextField, Box, Typography } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import userStore from '../store/userStore'
import useMediaQuery from '@mui/material/useMediaQuery';
import '../App.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loginWithEmail } = userStore()
  const isSmallScreen = useMediaQuery('(max-width:600px)');

  const handleSubmit = (event) => {
    event.preventDefault();

    // Reset errors
    setEmailError(false);
    setPasswordError(false);

    // Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError(true);
    }

    if (password === '') {
      setPasswordError(true);
    }
    const payload = { email, password };
    if (emailError || passwordError) {
      return;
    } else {
      loginWithEmail(payload);
    }
  };

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <Container maxWidth="md" sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <Box
        sx={{
          width: '100%',
          marginTop: '40px',
          marginBottom: '40px',
          bgcolor: 'primary.main',
          color: 'white',
          p: 2,
          textAlign: 'center',
          borderRadius: '9px',
        }}>
        <Typography variant="h6">북두칠성 서점에 오신 것을 환영합니다.</Typography>
      </Box>
      <Grid container spacing={1} sx={{ flexGrow: 1 }}>
        <Grid item xs={12} md={6} sx={{ order: { xs: 1, md: 2 }, display: { xs: 'none', md: 'flex' }, alignItems: 'center', justifyContent: 'center', p: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginLeft: { md: 5, xs: 0 }, marginTop: 0 }}>
            <img style={{ width: '100%', maxHeight: '100%', objectFit: 'contain' }} src="/image/login.png" alt="Login Illustration" />
          </Box>
        </Grid>
        <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              boxShadow: 3,
              p: 3,
              borderRadius: 2,
              width: '100%',
              maxWidth: '400px',
            }}>
            <Typography component="h1" variant="h5">
              Login
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
              <FormControl margin="normal" required fullWidth>
                <TextField
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={emailError}
                  helperText={emailError ? 'Please enter a valid email address.' : ''}
                />
              </FormControl>
              <FormControl margin="normal" required fullWidth>
                <TextField
                  label="Password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={passwordError}
                  helperText={passwordError ? 'Please enter your password.' : ''}
                />
              </FormControl>
              <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 3, mb: 2 }}>
                Sign In
              </Button>
              <Button fullWidth variant="outlined" color="primary" sx={{ mt: 1, mb: 2 }} onClick={() => navigate('/register')}>
                Go to Register
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
      <Box
        sx={{
          width: '100%',
          marginTop: '40px',
          marginBottom: '40px',
          bgcolor: 'primary.main',
          color: 'white',
          p: 2,
          textAlign: 'center',
          borderRadius: '9px',
        }}>
        <Typography variant="body1">Need help? Contact us at support@example.com</Typography>
      </Box>
    </Container>
  );
};

export default LoginPage;
