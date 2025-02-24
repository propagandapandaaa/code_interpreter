import React from 'react';
import Footer from '../elements/Footer';
import './Landing.css'; // Importing the updated minimalistic CSS

const Landing = () => {
    return (
        <div className="landingpage">
            {/* Hero Section */}
            <section id="hero">
                <div className="hero-content">
                    <h1> &lt;BitWars/&gt; </h1>
                    <p>Challenge your algorithms against others. Let’s see who writes the best code!</p>
                    <div className="cta-buttons">
                        <a href="/sign-up" className="cta-btn">Start Battling</a>
                        <a href="/challenges" className="cta-btn">View Challenges</a>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works">
                <h2>How It Works</h2>
                <div className="steps">
                    <div className="step">
                        <h3>Submit Your Code</h3>
                        <p>Write and submit your algorithm to a challenge.</p>
                    </div>
                    <div className="step">
                        <h3>Battle Against Others</h3>
                        <p>Your code competes against other submissions in real-time!</p>
                    </div>
                    <div className="step">
                        <h3>Track Your Performance</h3>
                        <p>Check your results and improve your code based on feedback.</p>
                    </div>
                </div>
            </section>

            {/* Footer Section */}
        </div>
    );
};

export default Landing;