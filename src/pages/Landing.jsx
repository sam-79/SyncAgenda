import { useSelector } from 'react-redux';
import Button from '@mui/material/Button';
import { Link } from 'react-router';

export default function LandingPage() {
    const { userData } = useSelector(state => state.auth);

    return (
        <div><div>header</div>
            <h1>Welcome to AI Meeting Assistant</h1>
            {userData ? (
                <Button variant="contained" component={Link} to={'/dashboard'}>Dashboard</Button>

            ) : (
                <Button variant="contained" component={Link} to={'/user-auth'}>Signin</Button>
            )}
            <div>footer</div>
        </div>
    );
}
