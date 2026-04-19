import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";

import Header from "../components/Header";
import HeaderDashboard from "../components/HeaderDashboard";
import type { RootState } from "../hooks/store";

function HomePage() {
    const navigate = useNavigate();

    const token = useSelector((state: RootState) => state.auth.user);

    useEffect(() => {
        if (!token) {
            navigate("/");
        }
    }, [token, navigate]);

    return (
        <>
            <Header />
            <HeaderDashboard />
        </>
    );
}

export default HomePage;
