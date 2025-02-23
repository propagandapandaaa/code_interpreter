import React, { useState } from 'react';
import { auth } from '../../firebaseConfig.js';
import { signInWithEmailAndPassword } from 'firebase/auth';
import './Login.css';  // Add your styles if needed

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            alert('Logged in successfully!');
        } catch (error) {
            if (error.code === 'auth/user-not-found') {
                console.log('No user found with this email.');
            } else if (error.code === 'auth/wrong-password') {
                console.log('Incorrect password. Please try again.');
            } else {
                console.log(error.message);
            }
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2 className="login-title">Login</h2>
                <form onSubmit={handleLogin} className="login-form">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="login-input"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="login-input"
                        required
                    />
                    <button type="submit" className="login-button">Login</button>
                    {error && <p className="login-error">{error}</p>}
                </form>
            </div>
        </div>
    );
};

export default Login;