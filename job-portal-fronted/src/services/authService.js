import api from './api.js';

const authService = {
    // Register new user
    register: async (userData) => {
        const response = await api.post('/auth/register/', userData);

        if (response.data.tokens) {
            localStorage.setItem('access_token', response.data.tokens.access);
            localStorage.setItem('refresh_token', response.data.tokens.refresh);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }

        return response.data;
    },

    // Login user
    login: async (credentials) => {
        const response = await api.post('/auth/login/', credentials);

        if (response.data.tokens) {
            localStorage.setItem('access_token', response.data.tokens.access);
            localStorage.setItem('refresh_token', response.data.tokens.refresh);

            // Fetch user profile after login
            const profileResponse = await api.get('/auth/profile/');
            localStorage.setItem('user', JSON.stringify(profileResponse.data));
        }

        return response.data;
    },

    // Logout user
    logout: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
    },

    // Get current user
    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    // Get user profile
    getProfile: async () => {
        const response = await api.get('/auth/profile/');
        localStorage.setItem('user', JSON.stringify(response.data));
        return response.data;
    },

    // Update employer profile
    updateEmployerProfile: async (profileData) => {
        const formData = new FormData();
        Object.keys(profileData).forEach(key => {
            if (profileData[key] !== null && profileData[key] !== undefined) {
                formData.append(key, profileData[key]);
            }
        });

        const response = await api.patch('/auth/profile/jobseeker/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        return response.data;
    }
};

export default authService;
