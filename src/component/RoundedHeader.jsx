import React from 'react';
import {
    AppBar,
    Toolbar,
    Box,
    Typography,
    IconButton,
    useTheme,
} from '@mui/material';
import { styled } from '@mui/system';
import { useColorMode } from '../theme/ColorModeContext';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import FlightIcon from '@mui/icons-material/Flight'; // Replace with your actual logo icon
import { useNavigate } from 'react-router';

const StickyRoundedAppBar = styled(AppBar)(({ mode }) => ({
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'primary',
    borderRadius: 40,
    maxWidth: '1100px',
    margin: '12px auto',
    padding: '4px 24px',
    boxShadow: '0px 2px 10px rgba(0,0,0,0.15)',
    position: 'fixed',
    zIndex: 1200,
}));

export default function Header() {
    const theme = useTheme();
    const { mode, toggleColorMode } = useColorMode();
    const navigate = useNavigate();

    return (
        <StickyRoundedAppBar elevation={0}>
            <Toolbar disableGutters sx={{ justifyContent: 'space-between', width: '100%' }}>
                {/* Logo + Brand */}
                <Box display="flex" alignItems="center" gap={1} onClick={()=> navigate('/')}>
                    {/* <FlightIcon sx={{ color: theme.palette.primary.main }} /> */}
                    <Typography variant="h6" fontWeight={700}>
                        SyncAgenda
                        <span style={{ color: theme.palette.text.secondary }}>.ai</span>
                    </Typography>
                </Box>

                {/* Theme Toggle */}
                <IconButton
                    onClick={toggleColorMode}
                    color="inherit"
                    sx={{
                        transition: 'transform 0.4s ease',
                        '&:hover': {
                            transform: 'rotate(360deg)',
                        },
                    }}
                >
                    {mode === 'light' ? <LightModeIcon /> : <DarkModeIcon />}
                </IconButton>
            </Toolbar>
        </StickyRoundedAppBar>
    );
}
