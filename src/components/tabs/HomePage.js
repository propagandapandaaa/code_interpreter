import React, { useEffect, useState } from 'react';
import { auth, db } from '../../firebaseConfig.js';
import { doc, getDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
    const [username, setUsername] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                try {
                    const userDoc = await getDoc(doc(db, 'users', user.uid));
                    if (userDoc.exists()) {
                        setUsername(userDoc.data().username);
                    } else {
                        setError('User data not found.');
                    }
                } catch (error) {
                    setError('Error fetching user data.');
                }
            }
        });

        // Cleanup the listener on component unmount
        return () => unsubscribe();
    }, []);

    return (
        <div className="homepage">
            {/* Hero Section */}
            <section id="hero">
                <div className="hero-content">
                    <h1>{username ? `Welcome back, ${username}` : 'Welcome to Code Wars'}</h1>
                    <p>Challenge your coding skills, improve your algorithms, and climb the leaderboard.</p>
                    <Link to="/challenges" className="cta-btn">Join a Challenge</Link>
                </div>
            </section>

            {/* Dashboard Section */}
            <section id="dashboard">
                <h2>Your Dashboard</h2>
                <div className="dashboard-info">
                    <div className="stat-card">
                        <h3>Active Challenges</h3>
                        <p>3 Challenges</p>
                    </div>
                    <div className="stat-card">
                        <h3>Your Rank</h3>
                        <p>#5</p>
                    </div>
                    <div className="stat-card">
                        <h3>Completed Challenges</h3>
                        <p>12 Challenges</p>
                    </div>
                </div>
            </section>

            {/* Featured Challenges Section */}
            <section id="featured-challenges">
                <h2>Featured Challenges</h2>
                <div className="challenges-list">
                    <div className="challenge-card">
                        <h3>Challenge 1</h3>
                        <p>Max Participants: 10</p>
                        <Link to="/challenge/1" className="cta-btn">Join Now</Link>
                    </div>
                    <div className="challenge-card">
                        <h3>Challenge 2</h3>
                        <p>Max Participants: 5</p>
                        <Link to="/challenge/2" className="cta-btn">Join Now</Link>
                    </div>
                    <div className="challenge-card">
                        <h3>Challenge 3</h3>
                        <p>Max Participants: 7</p>
                        <Link to="/challenge/3" className="cta-btn">Join Now</Link>
                    </div>
                </div>
            </section>

            {/* Community Section */}
            <section id="community">
                <h2>Join the Community</h2>
                <p>Connect with other developers, participate in challenges, and track your progress!</p>
                <Link to="/leaderboard" className="cta-btn">View Leaderboard</Link>
            </section>
        </div>
    );
};

export default HomePage;