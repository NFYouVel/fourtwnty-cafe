import { useEffect } from "react";
import { useNavigate } from "react-router";

import Header from "../components/Header";
import HeaderDashboard from "../components/HeaderDashboard";

function HomePage() {
    const navigate = useNavigate();

    useEffect(() => {
        const token = document.cookie
            .split("; ")
            .find(row => row.startsWith("token="))
            ?.split("=")[1];


        if (!token) {
            navigate("/");
        }
    }, [navigate]);

    return (
        <>
            <Header />
            <HeaderDashboard />
        </>
    );
}

export default HomePage;
