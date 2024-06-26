import React, { useState } from "react";
import { Link } from "react-router-dom";
import '@fortawesome/fontawesome-free/css/all.css';
import './Navbar.css'
import { Button } from './Button';
import DropdownMenu from "./test/DropdownMenu";

function Navbar() {
    const [click, setClick] = useState(false);
    const [button, setButton] = useState(true);

    const handleClick = () => setClick(!click);
    const closeMobileMenu = () => setClick(false);

    const showButton = () => {
        if (window.innerWidth <= 960) {
            setButton(false);
        } else {
            setButton(true);
        }
    }

    window.addEventListener('resize', showButton);

    return (
        <>
            <nav className="navbar">
                <div className="navbar-container">
                    <Link to='/' className="navbar-logo">
                        Test Site <i className="fab fa-typo3"></i>
                    </Link>
                    <DropdownMenu buttonText="Options" menuItems={["Profile", "Settings", "Logout"]} />
                    <div className="menu-icon" onClick={handleClick}>
                        <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
                    </div>
                    <ul className={click ? "nav-menu-active" : "nav-menu"}>
                        <li className="nav-item">
                            <Link to="/home" className="nav-links" onClick={closeMobileMenu}>
                                Home
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link to="/editor" className="nav-links" onClick={closeMobileMenu}>
                                Editor
                            </Link>
                        </li>
                    </ul>
                    {button && <Button buttonStyle="btn--outline">SIGN UP</Button>}
                </div>
            </nav>
        </>
    );
}

export default Navbar;
