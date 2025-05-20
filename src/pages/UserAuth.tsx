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
    useTheme
} from '@mui/material';
import { useNavigate } from 'react-router';
import { signin } from '../api/auth';
import { logout } from '../../redux/features/authSlice';
import Lottie from "lottie-react";
import loginAnimation from '../assets/lottie/login.json';

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

const SignUp = () => (
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
);

export default function UserAuth() {
    const { userData } = useSelector((state) => state.auth);
    const [isSignUp, setIsSignUp] = useState(false);
    const dispatch = useDispatch();
    const theme = useTheme();

    return (
        <>
            {userData ? (
                <Container>
                    <Typography variant="h6">User already logged in</Typography>
                    <Typography>Current user: {userData.username}</Typography>
                    <Button variant="contained" onClick={() => dispatch(logout())}>
                        Logout
                    </Button>
                </Container>
            ) : (
                <Grid container justifyContent="center" alignItems="center" minHeight="100vh">
                    <Grid item xs={12} sm={10} md={8}>
                        <Paper elevation={6} sx={{ p: 4, borderRadius: 3 }}>
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
                                    {isSignUp ? <SignUp /> : <SignIn />}
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
            )}
        </>
    );
}
