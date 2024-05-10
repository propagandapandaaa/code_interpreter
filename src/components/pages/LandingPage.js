import React from 'react';
import './LandingPage.css';

function LandingPage() {
    return (
        <div className="landing-page-container">
            <h1 style={{ color: 'white' }}>Frogs.</h1>
            <p style={{ color: "#f0f0f0" }}>A lot of frogs.</p>
            <button className='fancy-button'>Get a frog!</button>
        </div>
    );
}


export default LandingPage;
