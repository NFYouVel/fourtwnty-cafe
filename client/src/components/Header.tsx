import "../styles/header.css";
import { useState } from "react";

import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

import profilePicture from "../assets/Logo Kopi.png";

function Header() {
    const [darkMode, setDarkMode] = useState(false);

    const toggleTheme = () => {
        setDarkMode(!darkMode);
        document.body.classList.toggle("dark-theme");
    };

    return (
        <div className="wrapper-header">
            <div className="wrapper-logo"></div>

            <div className="wrapper-header-profile">
                <div className="wrapper-theme" onClick={toggleTheme}>
                    {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
                </div>

                <div className="wrapper-profile-picture">
                    <img src={profilePicture} alt="Profile" />
                </div>
            </div>
        </div>
    );
}

export default Header;
