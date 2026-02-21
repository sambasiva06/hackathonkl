import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import DashboardLayout from './layouts/DashboardLayout'

// Pages
import Login from './pages/Login'
import Register from './pages/Register'
import PractitionerDashboard from './pages/practitioner/Dashboard'
import PatientList from './pages/practitioner/PatientList'
import CreateTherapyPlan from './pages/practitioner/CreateTherapyPlan'
import ScheduleSession from './pages/practitioner/ScheduleSession'
import FeedbackViewer from './pages/practitioner/FeedbackViewer'

import MyTimeline from './pages/patient/MyTimeline'
import SessionDetails from './pages/patient/SessionDetails'
import SubmitFeedback from './pages/patient/SubmitFeedback'
import PatientProfile from './pages/patient/Profile'

import './App.css'

const ProtectedRoute = ({ children, role }) => {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" />;
    if (role && user.role !== role) {
        return <Navigate to={user.role === 'PRACTITIONER' ? '/dashboard' : '/timeline'} />;
    }
    return children;
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Practitioner Routes */}
                    <Route element={<ProtectedRoute role="PRACTITIONER"><DashboardLayout /></ProtectedRoute>}>
                        <Route path="/dashboard" element={<PractitionerDashboard />} />
                        <Route path="/patients" element={<PatientList />} />
                        <Route path="/plans" element={<CreateTherapyPlan />} />
                        <Route path="/schedule" element={<ScheduleSession />} />
                        <Route path="/feedback" element={<FeedbackViewer />} />
                    </Route>

                    {/* Patient Routes */}
                    <Route element={<ProtectedRoute role="PATIENT"><DashboardLayout /></ProtectedRoute>}>
                        <Route path="/timeline" element={<MyTimeline />} />
                        <Route path="/sessions" element={<SessionDetails />} />
                        <Route path="/submit-feedback" element={<SubmitFeedback />} />
                        <Route path="/profile" element={<PatientProfile />} />
                    </Route>

                    {/* Default Redirection */}
                    <Route path="/" element={<Navigate to="/login" />} />
                </Routes>
            </Router>
        </AuthProvider>
    )
}

export default App
