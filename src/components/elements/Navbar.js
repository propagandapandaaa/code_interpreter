import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from '../../AuthProvider'; // Adjust the import path
import '@fortawesome/fontawesome-free/css/all.css';
import './Navbar.css';
import { getAuth } from 'firebase/auth';

function Navbar() {
    const [click, setClick] = useState(false);
    const [button, setButton] = useState(true);
    const { user } = useAuth();
    const [profilePic, setProfilePic] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(false);

    // Fetch the user's profile picture
    useEffect(() => {
        if (user) {
            setProfilePic(user.photoURL || "");
        }
    }, [user]);

    const handleClick = () => setClick(!click);
    const closeMobileMenu = () => setClick(false);

    const showButton = () => {
        if (window.innerWidth <= 960) {
            setButton(false);
        } else {
            setButton(true);
        }
    };

    window.addEventListener('resize', showButton);

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to='/home' className="navbar-logo">
                    &lt;BitWars/&gt;
                </Link>
                <div className="menu-icon" onClick={handleClick}>
                    <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
                </div>
                <ul className={click ? "nav-menu-active" : "nav-menu"}>
                    <li className="nav-item">
                        <Link to="/home" className="nav-links" onClick={closeMobileMenu}>
                            Home
                        </Link>
                    </li>
                    {user && (
                        <li className="nav-item">
                            <Link to="/editor" className="nav-links" onClick={closeMobileMenu}>
                                Editor
                            </Link>
                        </li>
                    )}
                    {user && (
                        <li className="nav-item">
                            <Link to="/challenges" className="nav-links" onClick={closeMobileMenu}>
                                Challenges
                            </Link>
                        </li>
                    )}
                </ul>

                <div className="nav-auth">
                    {!user && button && (
                        <>
                            <Link to="/login" className="btn-link">
                                <button buttonStyle="btn--outline">LOGIN</button>
                            </Link>
                            <Link to="/sign-up" className="btn-link">
                                <button buttonStyle="btn--outline">SIGNUP</button>
                            </Link>
                        </>
                    )}
                    {user && button && (
                        <div className="nav-profile-wrapper">
                            <div
                                className="nav-profile-pic-container"
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                            >
                                {profilePic ? (
                                    <img
                                        src={profilePic}
                                        alt="Profile"
                                        className="nav-profile-pic"
                                    />
                                ) : (
                                    <div className="nav-profile-pic default-profile"></div>
                                )}
                            </div>
                            {dropdownOpen && (
                                <div className="nav-dropdown-menu">
                                    <Link to="/profile" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                                        Profile
                                    </Link>
                                    <button
                                        onClick={() => {
                                            getAuth().signOut();
                                            setDropdownOpen(false);
                                        }}
                                        className="dropdown-item logout-button"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
