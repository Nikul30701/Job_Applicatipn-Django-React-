import React, { createContext, useState, useEffect, useContext } from 'react'
import authService from '../services/authService'


const AuthContext = createContext();

const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Check if user is already logged in on mount

        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
        setLoading(false);
    }, []);

    const login = async (credentials) => {
        try {
            await authService.login(credentials);
            const currentUser = authService.getCurrentUser();
            setUser(currentUser);
            return {success: true};
        } catch (error) {
            return {
                success:false,
                error: error.response?.data?.detail || 'Login failed',
            };
        }
    };

    const register = async (userData) => {
        try {
            const response = await authService.register(userData);
            setUser(response.user);
            return {success: true};
        } catch (error) {
            return {
                success: false,
                error: error.response?.data || 'Registration failed',
            }
        }
    }

    const logout = () => {
        authService.logout();
        setUser(null);
    }

    const updateUser = async () => {
        try {
            const updatedUser  = await authService.getProfile();
            setUser(updateUser);
        } catch (error) {
            console.error('Failed to update user:', error);          
        }
    };

    const value = {
        user,
        login,
        register,
        logout,
        updateUser,
        isAuthenticated: !!user,
        isEmployer: user?.user_type == 'employer',
        iseJobSeeker: user?.user_type == 'job_seeker',
    };

    if (loading) {
        return (
            <div className='flex items-center justify-center min-h-screen'>
                <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
            </div>
        )
    }
    return <AuthContext.Provider value={value} >
        {children}
    </AuthContext.Provider>
}

export default AuthProvider;

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider.');
    }
    return context;
}
