import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Grid,
    Paper,
    Alert
} from '@mui/material';
import { useParams, useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { SendOTP, VerifyOTP } from './../api/auth';

const OTPVerify = ({ email, setIsOTPSent, setAlertSeverity,
    setSnackbarMsg,
    setSnackbarOpen }) => {
    const navigate = useNavigate();
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [timer, setTimer] = useState(0);
    const [error, setError] = useState('');
    const [generatingOTP, setGeneratingOTP] = useState(false);
    const [generatedOTP, setGeneratedOTP] = useState(false);
    const inputsRef = useRef([]);

    // countdown
    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handleChange = (value, index) => {
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        if (value && index < 5) {
            inputsRef.current[index + 1]?.focus();
        }
        if (!value && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    };

    const handleSendOTP = async () => {
        try {
            setGeneratingOTP(true);
            const res = await SendOTP({ username: email });
            setGeneratedOTP(true);
            setTimer(60);
            setError('');
            alert(res.msg || 'OTP sent successfully');
        } catch {
            setError('Failed to send OTP');
        } finally {
            setGeneratingOTP(false);
        }
    };

    const handleVerify = async () => {
        const otpString = otp.join('');
        if (otpString.length !== 6) {
            setError('Please enter the full 6-digit OTP');
            return;
        }

        try {
            const res = await VerifyOTP({ username: email, otp: otpString });
            if (res?.detail?.is_verified) {
                alert('OTP Verified!');
                setAlertSeverity('success')
                setSnackbarMsg("OTP Verified, please login")
                setSnackbarOpen(true)
                setIsOTPSent(false)
                // navigate('/user-auth'); // go back to login
            } else {
                setError(res.detail?.msg || 'Verification failed');
            }
        } catch {
            setError('Verification failed');
        }
    };

    return (
        <Paper elevation={6} sx={{ p: 4, borderRadius: 3 }}>
            <Typography variant="h5" fontWeight={600} gutterBottom>
                OTP Verification
            </Typography>

            <Box mb={3}>
                <Typography variant="body2">
                    We’ve sent a 6-digit OTP to your email <strong>{email}</strong>
                </Typography>

                <Typography variant='body5' color='blue' onClick={() => setIsOTPSent(false)} >
                    Change email
                </Typography>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Box display="flex" justifyContent="space-between" gap={1} mb={3}>
                {otp.map((digit, index) => (
                    <TextField
                        key={index}
                        inputRef={(el) => (inputsRef.current[index] = el)}
                        value={digit}
                        onChange={(e) => handleChange(e.target.value.slice(-1), index)}
                        inputProps={{
                            maxLength: 1,
                            style: { textAlign: 'center', fontSize: '1.5rem' },
                        }}
                        sx={{ width: '3rem' }}
                    />
                ))}
            </Box>

            <Button
                variant="contained"
                fullWidth
                onClick={handleVerify}
                sx={{ mb: 2 }}
            >
                Verify
            </Button>

            <Button
                variant="outlined"
                fullWidth
                onClick={handleSendOTP}
                disabled={timer > 0}
            >
                {timer > 0 ? `Resend OTP in ${timer}s` : 'Resend OTP'}
            </Button>
        </Paper>

    );
};

export default OTPVerify;
