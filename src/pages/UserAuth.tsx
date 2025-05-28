import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    Container,
    Box,
    Button,
    Typography,
    TextField,
    Grid,
    Paper,
    FormControl,
    useTheme,
    Alert,
    Snackbar,
    Link,
    Avatar
} from '@mui/material';
import { Outlet, useNavigate } from 'react-router';
import { SendOTP, signin, signup } from '../api/auth';
import { logout, setUserData } from '../../redux/features/authSlice';
import Lottie from "lottie-react";
import loginAnimation from '../assets/lottie/login.json';
import OTPVerify from './OTPVerify';
import Header from '../component/RoundedHeader';

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSignin = async () => {
        if (email.trim() === '' || password.trim() === '') {
            alert('Please enter both email and password.');
            return;
        }
        const params = { username: email, password };
        try {
            const resultAction = await dispatch(signin(params));
            if (resultAction.type === 'auth/signin/fulfilled') {
                navigate('/dashboard', { replace: true });
            } else {
                console.error('Sign in failed', resultAction.error);
            }
        } catch (error) {
            console.error('Error during signin:', error);
        }
    };

    return (
        <Box mt={3}>
            <Typography variant="h4" fontWeight={600} gutterBottom>
                Welcome Back
            </Typography>
            <Typography variant="subtitle1" gutterBottom color="text.secondary">
                Please sign in to continue
            </Typography>
            <FormControl fullWidth margin="normal">
                <TextField
                    label="Email"
                    variant="outlined"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </FormControl>
            <FormControl fullWidth margin="normal">
                <TextField
                    label="Password"
                    variant="outlined"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </FormControl>
            <Button variant="contained" fullWidth size="large" sx={{ mt: 2 }} onClick={handleSignin}>
                Sign In
            </Button>
        </Box>
    );
};

const SignUp = () => {


    return (
        <Box mt={3}>
            <Typography variant="h4" fontWeight={600} gutterBottom>
                Create Account
            </Typography>
            <Typography variant="subtitle1" gutterBottom color="text.secondary">
                Join us to explore more
            </Typography>
            <FormControl fullWidth margin="normal">
                <TextField label="Name" />
            </FormControl>
            <FormControl fullWidth margin="normal">
                <TextField label="Email" />
            </FormControl>
            <FormControl fullWidth margin="normal">
                <TextField label="Password" type="password" />
            </FormControl>
            <Button variant="contained" fullWidth size="large" sx={{ mt: 2 }}>
                Sign Up
            </Button>
        </Box>
    )
};

export default function UserAuth() {
    const { userData } = useSelector((state) => state.auth);
    const [isSignUp, setIsSignUp] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const theme = useTheme();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [isOTPSent, setIsOTPSent] = useState(false);


    const [alertSeverity, setAlertSeverity] = useState<'error'
        | 'info'
        | 'success'
        | 'warning'
        | string>('');
    const [snackbarMsg, setSnackbarMsg] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const snackbarControls = {
        setAlertSeverity,
        setSnackbarMsg,
        setSnackbarOpen,
    };

    const handleSignIn = async () => {
        if (email.trim() === '' || password.trim() === '') {
            setAlertSeverity('error');
            setSnackbarMsg('Please enter both email and password.');
            setSnackbarOpen(true);
            return;
        }

        const params = { username: email, password, hostname: import.meta.env.VITE_BACKEND_SERVER_HOST_URL };

        try {
            const resultAction = await dispatch(signin(params));
            const response = resultAction.payload?.detail;
            console.log("response:", response)

            if (resultAction.type === 'auth/signin/fulfilled') {

                if (!response?.is_verified) {
                    setAlertSeverity('warning');
                    setSnackbarMsg(response?.msg || 'Email verification required');
                    setSnackbarOpen(true);

                    try {
                        await SendOTP({ username: email, hostname: params.hostname });
                        sessionStorage.setItem('otpRequested', 'true');
                        setIsOTPSent(true);
                    } catch {
                        setAlertSeverity('error');
                        setSnackbarMsg('Failed to send OTP');
                        setSnackbarOpen(true);
                    }

                } else {
                    // User is verified
                    // const userData = {
                    //     ...detail,
                    //     access_token: detail.access_token,
                    // };
                    // dispatch(setUser(userData));
                    dispatch(setUserData(response))
                    setAlertSeverity('success');
                    setSnackbarMsg('User logged in');
                    setSnackbarOpen(true);
                    navigate('/dashboard');

                }

            } else {
                const msg = response?.detail?.msg || 'Login failed';
                setAlertSeverity('error');
                setSnackbarMsg(msg);
                setSnackbarOpen(true);
            }

        } catch (error) {
            console.error('Login error:', error);
            setAlertSeverity('error');
            setSnackbarMsg('An error occurred during sign in');
            setSnackbarOpen(true);
        }
    };


    const handleSignUp = async () => {
        if (name.trim() === '' || email.trim() === '' || password.trim() === '') {
            setAlertSeverity('error');
            setSnackbarMsg('Please fill all fields.');
            setSnackbarOpen(true);
            return;
        }

        const params = { name, username: email, password, hostname: import.meta.env.VITE_BACKEND_SERVER_HOST_URL };

        try {
            const resultAction = await dispatch(signup(params));
            const response = resultAction.payload;
            console.log("resultAction", resultAction)
            if (resultAction.type === 'signup/fulfilled') {
                const msg = response?.detail?.msg || 'Signup complete.';
                const isVerified = response?.detail?.is_verified === true;

                setAlertSeverity('info');
                setSnackbarMsg(msg);
                setSnackbarOpen(true);

                if (!isVerified) {
                    // Send OTP
                    try {
                        let response = await SendOTP({ username: email });
                        response = await response.json()
                        // sessionStorage.setItem('otpRequested', 'true');
                        setIsOTPSent(true);
                    } catch (otpError) {
                        console.log("otpError", response)
                        setAlertSeverity('error');
                        setSnackbarMsg('Failed to send OTP');
                        setSnackbarOpen(true);
                    }
                }
            } else {
                const msg = response?.detail?.msg || 'Something went wrong';
                setAlertSeverity('error');
                setSnackbarMsg(msg);
                setSnackbarOpen(true);
            }
        } catch (error) {
            console.error('Signup error:', error);
            setAlertSeverity('error');
            setSnackbarMsg('Signup failed due to server error');
            setSnackbarOpen(true);
        }
    };

    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    };


    return (
        <>
            <Box sx={{ p: 2, position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 1000 }}>
                <Header />
                {/* <Button
                  variant="contained"
                  component={Link}
                  to={userData ? '/dashboard' : '/user-auth'}
                  size="large"
                >
                  {userData ? 'Go to Dashboard' : 'Get Started'}
                </Button> */}
            </Box>
            {userData ? (
                <Container>
                    <Typography variant="h6">User already logged in</Typography>
                    <Typography>Current user: {userData.username}</Typography>
                    <Button variant="contained" onClick={() => dispatch(logout())}>
                        Logout
                    </Button>
                </Container>
            ) :
                <Grid container justifyContent="center" alignItems="center" minHeight="100vh">
                    <Grid item xs={12} sm={10} md={8}>
                        {
                            isOTPSent ?
                                <OTPVerify email={email} setIsOTPSent={setIsOTPSent} {...snackbarControls} />
                                :
                                <Paper elevation={6} onMouseMove={handleMouseMove}
                                    sx={{
                                        p: 4,
                                        borderRadius: 3,
                                        position: 'relative',
                                        overflow: 'hidden',
                                        // background: `radial-gradient(
                                        //         150px circle at ${mousePosition.x}px ${mousePosition.y}px,
                                        //         rgba(255, 255, 255, 0.17),
                                        //         transparent 70%
                                        //     ),
                                        // linear-gradient(135deg, #2e2e3f 0%, #f50057 100%)`, // fallback dark background
                                        // transition: 'background 0.2s ease-out',
                                    }} >
                                    <Grid container spacing={2}>
                                        <Grid
                                            item
                                            xs={12}
                                            md={6}
                                            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                        >
                                            <Lottie animationData={loginAnimation} loop style={{ height: 280 }} />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Box display="flex" justifyContent="center" gap={1} mb={2}>
                                                <Button
                                                    variant={!isSignUp ? 'contained' : 'outlined'}
                                                    onClick={() => setIsSignUp(false)}
                                                    fullWidth
                                                >
                                                    Sign In
                                                </Button>
                                                <Button
                                                    variant={isSignUp ? 'contained' : 'outlined'}
                                                    onClick={() => setIsSignUp(true)}
                                                    fullWidth
                                                >
                                                    Sign Up
                                                </Button>
                                            </Box>
                                            <Box mt={3}>

                                                {
                                                    isSignUp ?
                                                        <>
                                                            <Typography variant="h4" fontWeight={600} gutterBottom>
                                                                Create Account
                                                            </Typography>
                                                            <Typography variant="subtitle1" gutterBottom color="text.secondary">
                                                                Join us to explore more
                                                            </Typography>
                                                        </>
                                                        :
                                                        <>
                                                            <Typography variant="h4" fontWeight={600} gutterBottom>
                                                                Welcome Back
                                                            </Typography>
                                                            <Typography variant="subtitle1" gutterBottom color="text.secondary">
                                                                Please sign in to continue
                                                            </Typography>
                                                        </>

                                                }


                                                <FormControl fullWidth margin="normal" >
                                                    <TextField
                                                        label="Name"
                                                        variant="outlined"
                                                        type="text"
                                                        value={name}
                                                        onChange={(e) => setName(e.target.value)}
                                                        disabled={!isSignUp}
                                                        sx={{ opacity: !isSignUp && 0.5, color: 'error' }} />
                                                </FormControl>

                                                <FormControl fullWidth margin="normal">
                                                    <TextField
                                                        label="Email"
                                                        variant="outlined"
                                                        type="email"
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                    />
                                                </FormControl>
                                                <FormControl fullWidth margin="normal">
                                                    <TextField
                                                        label="Password"
                                                        variant="outlined"
                                                        type="password"
                                                        value={password}
                                                        onChange={(e) => setPassword(e.target.value)}
                                                    />
                                                </FormControl>
                                                <Button variant="contained" fullWidth size="large" sx={{ mt: 2 }} onClick={isSignUp ? handleSignUp : handleSignIn}>
                                                    {isSignUp ? 'Sign Up' : 'Sign In'}
                                                </Button>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Paper>
                        }
                    </Grid>
                </Grid>
            }

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
                <Alert severity={alertSeverity} sx={{ width: '100%' }}>
                    {snackbarMsg}
                </Alert>
            </Snackbar>
        </>
    );
}
