import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebaseConfig';  // Ensure the correct path

const Logout = ({ onLogout }) => {
    const handleLogout = async () => {
        try {
            await signOut(auth);
            console.log("User logged out successfully.");
            onLogout(); // Call the callback function passed as a prop to handle UI updates or redirects
        } catch (error) {
            console.error("Error logging out:", error.message);
        }
    };

    return (
        <button onClick={handleLogout}>Log Out</button>
    );
};

export default Logout;