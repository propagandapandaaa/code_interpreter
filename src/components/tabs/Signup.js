import React, { useState } from 'react';
import { auth, db } from '../../firebaseConfig.js';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDocs, collection, query, where } from 'firebase/firestore';
import './Signup.css';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState(null);

    const handleSignup = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            // Check if the username is already taken


            const usernameQuery = query(collection(db, 'users'), where('username', '==', username));
            const usernameSnapshot = await getDocs(usernameQuery);

            if (!usernameSnapshot.empty) {
                setError('Username is already taken. Please choose a different one.');
                return;
            }


            // Create a new user with Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Save user data to Firestore with default role "user"
            await setDoc(doc(db, 'users', user.uid), {
                email: user.email,
                username: username,
                role: 'user', // Default role set to "user"
                createdAt: new Date(),
            });

            alert('User registered successfully!');
        } catch (error) {
            if (error.code === 'auth/email-already-in-use') {
                setError('Email is already in use. Please use a different email.');
            } else if (error.code === 'auth/weak-password') {
                setError('Password should be at least 6 characters.');
            } else {
                setError(error.message);
            }
            console.log(error);
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
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
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