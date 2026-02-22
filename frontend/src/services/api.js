import axios from 'axios';

const api = axios.create({
    baseURL: '', // Using Vite proxy
    headers: {
        'Content-Type': 'application/json',
    },
});

// Intercept to add JWT token
api.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
});

// Intercept responses to handle 401 (Unauthorized)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const authService = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
};

export const practitionerService = {
    getDashboard: () => api.get('/api/dashboard'),
    getPatients: () => api.get('/api/patients'),
    createPatient: (patientData) => api.post('/api/patients', patientData),
    createTherapyPlan: (planData) => api.post('/api/therapy-plan', planData),
    getTherapyPlans: () => api.get('/api/therapy-plans'),
    scheduleSession: (sessionData) => api.post('/api/session', sessionData),
    updateSessionStatus: (sessionId, status) => api.put(`/api/session/${sessionId}/status?status=${status}`),
    getFeedback: () => api.get('/api/feedback'),
};

export const patientService = {
    getMySessions: () => api.get('/api/my-sessions'),
    getNotifications: () => api.get('/api/notifications'),
    submitFeedback: (feedbackData) => api.post('/api/feedback', feedbackData),
    getTherapyProgress: () => api.get('/api/therapy-progress'),
    getMyProfile: () => api.get('/api/my-profile'),
};

export default api;
