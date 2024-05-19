import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link for routing
import './DropdownMenu.css'

function DropdownMenu() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const menuItems = [
        { text: "Landing Page", path: "/" },
        { text: "Home", path: "/home" },
        { text: "Editor", path: "/editor" }
    ];

    return (
        <div className="dropdown-container">
            <button className="dropdown-button" onClick={toggleDropdown}>
                Navigate
            </button>
            {isOpen && (
                <ul className="dropdown-menu">
                    {menuItems.map((item, index) => (
                        <li key={index} className="dropdown-item">
                            <Link to={item.path} onClick={toggleDropdown}>
                                {item.text}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default DropdownMenu;