import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { Container, Box, Button, Typography, TextField, Grid, Paper, FormControl } from '@mui/material';
import { Link, useNavigate } from 'react-router';
import { signin } from '../api/auth';
import { logout } from '../../redux/features/authSlice';


const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigateTo = useNavigate()

    const handleSignin = async () => { // Make handleSignin async to use await
        if (email.trim() === '' || password.trim() === '') {
            alert('Please enter both email and password.'); // Basic alert.  Use a better UI, like a Snackbar
            return;
        }
        const params = {
            username: email,
            password: password,
        };

        try {
            const resultAction = await dispatch(signin(params)); // Await the dispatch
            if (resultAction.type == "auth/signin/fulfilled") {
                // Sign-in was successful.
                console.log("Sign in successful", resultAction);
                // Handle success (e.g., redirect, store token)
                navigateTo('/dashboard', { replace: true })
            } else {
                // Sign in was not successful, handle errors in the component
                console.error("Sign in failed", resultAction.error)
            }


        } catch (error) {
            // Handle any errors that occurred during the dispatch or API call
            console.error("Error during signin:", error);
        }
    };

    return (
        <Box mt={3}>
            <Typography variant="h6" gutterBottom>
                Sign In
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
            <Button variant="contained" color="primary" onClick={handleSignin}>
                Sign In
            </Button>
        </Box>
    );
};

const SignUp = () => (
    <Box>
        <Typography variant="h5">Sign Up</Typography>
        <TextField label="Name" fullWidth margin="normal" />
        <TextField label="Email" fullWidth margin="normal" />
        <TextField label="Password" type="password" fullWidth margin="normal" />
        <Button variant="contained" color="primary" fullWidth>
            Sign Up
        </Button>
    </Box>
);

export default function UserAuthPage() {
    const { userData } = useSelector(state => state.auth);
    const [isSignUp, setIsSignUp] = useState(false);
    const dispatch = useDispatch();


    return (
        <>
            {
                userData ? <>
                    User already loggedin
                    Current user: {userData.username}
                    <Button variant='contained' onClick={() => dispatch(logout())} >Logout</Button>
                </> :
                    <Container component="main" maxWidth="xs">
                        <Paper elevation={3} sx={{ padding: 3 }}>
                            <Box display="flex" justifyContent="space-between">
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
                            <Box mt={2}>
                                {isSignUp ? <SignUp /> : <SignIn />}
                            </Box>
                        </Paper>
                    </Container>
            }
        </>
    )
}

