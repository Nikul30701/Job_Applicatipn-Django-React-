import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const ProtectedRoute = ({children, requiredUserType = null}) => {
    const {isAuthenticated, user} = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    if (requiredUserType && user?.user_type !== requiredUserType) {
        return <Navigate to="/" replace />
    }
    return children;
}

export default ProtectedRoute