import React from 'react';
import { useNavigate } from 'react-router-dom';
import './UserProfile.css';

function UserProfile({ username, setIsLoggedIn }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear tokens and user data from localStorage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('username');
        
        // Update login state
        setIsLoggedIn(false);
        
        // Redirect to login page
        navigate('/login');
    };

    return (
        <div className="profile-container">
            <div className="profile-box">
                <div className="profile-header">
                    <div className="profile-avatar">
                        {username ? username[0].toUpperCase() : 'U'}
                    </div>
                    <h2>Welcome, {username}!</h2>
                </div>
                
                <div className="profile-info">
                    <div className="info-item">
                        <label>Username:</label>
                        <span>{username}</span>
                    </div>
                </div>

                <div className="profile-actions">
                    <button onClick={() => navigate('/')} className="action-button">
                        Go to Dashboard
                    </button>
                    <button onClick={handleLogout} className="action-button logout">
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}

export default UserProfile; 