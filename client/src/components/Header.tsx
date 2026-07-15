import "../styles/header.css";
import { useState } from "react";
import { useNavigate } from "react-router";

import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

import profilePicture from "../assets/Logo Kopi.png";
function Header() {
    const [darkMode, setDarkMode] = useState(false);
    const navigate = useNavigate();

    const toggleTheme = () => {
        setDarkMode(!darkMode);
        document.body.classList.toggle("dark-theme");
    };

    const handleLogout = () => {
        // hapus cookie token
        sessionStorage.clear();
        localStorage.clear();
        document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
        alert("Logout Success");
        navigate("/");
    };


    return (
        <div className="wrapper-header">
            <div className="wrapper-logo" onClick={() => navigate(-1)}></div>

            <div className="wrapper-header-profile">

                <div
                    className="wrapper-theme"
                    onClick={toggleTheme}
                >
                    {darkMode ? (
                        <LightModeIcon />
                    ) : (
                        <DarkModeIcon />
                    )}
                </div>

                <button
                    onClick={handleLogout}
                    style={{
                        marginRight: "10px",
                        padding: "8px 12px",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer"
                    }}
                >
                    Logout
                </button>

                <div
                    className="wrapper-profile-picture"
                    onClick={() => navigate("/profile")}
                >
                    <img src={profilePicture} alt="Profile" />
                </div>
            </div>
        </div>
    );
}

export default Header;
