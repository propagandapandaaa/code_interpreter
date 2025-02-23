import React, { useState } from 'react';
import { auth } from '../../firebaseConfig.js';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import './Signup.css';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            alert('User registered successfully!');
        } catch (error) {
            if (error.code === 'auth/email-already-in-use') {
                console.log('Email is already in use. Please use a different email.');
            } else {
                console.log(error.message);
            }
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-card">
                <h2 className="signup-title">Sign Up</h2>
                <form onSubmit={handleSignup} className="signup-form">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="signup-input"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="signup-input"
                        required
                    />
                    <button type="submit" className="signup-button">Sign Up</button>
                    {error && <p className="signup-error">{error}</p>}
                </form>
            </div>
        </div>
    );
};

export default Signup;