
import { useSelector } from 'react-redux';
import { Outlet, Navigate, useLocation } from 'react-router';

export default function ProtectedRoute({ children }) {
    const { userData } = useSelector(state => state.auth);
    const location = useLocation();

    if (!userData) {
        const redirectTo = `/user-auth?callbackUrl=${encodeURIComponent(location.pathname)}`;
        return <Navigate to={redirectTo} replace />;

    }

    return children;
}
