import "../styles/headerDashboard.css";
import { useSelector } from "react-redux";
import type { RootState } from "../hooks/store";
import { useState } from "react";

function HeaderDashboard() {
    const user = useSelector((state: RootState) => state.auth.user);
    const isCustomer = user?.user_role === "Customer";

    const [openMenu, setOpenMenu] = useState(false);

    return (
        <>
            {/* HEADER */}
            <div className="wrapper-dashboard-header">

                <div className="dashboard-left">

                    <div className="profile-info">
                        <h4>{user?.name || "Guest User"}</h4>
                        <p>{user?.user_role || "Staff"}</p>
                    </div>

                    <div className="divider"></div>

                    <div className="dashboard-title">
                        {isCustomer ? (
                            <>
                                <h2>Good Coffee, Good Mood ☕</h2>
                                <span>Welcome back! Ready for today?</span>
                            </>
                        ) : (
                            <>
                                <h2>Welcome to Twntiers Café</h2>
                                <span>Manage your store beautifully.</span>
                            </>
                        )}
                    </div>

                </div>

                {/* BURGER */}
                <div
                    className="burger-menu"
                    onClick={() => setOpenMenu(!openMenu)}
                >
                    ☰
                </div>

                {/* RIGHT */}
                <div className={`dashboard-right ${openMenu ? "active-menu" : ""}`}>
                    {isCustomer ? (
                        <>
                            <button className="btn-new">🛒 Order Now</button>
                            <button>☕ Coffee Menu</button>
                            <button>🍰 Desserts</button>
                            <button>⭐ Favorites</button>
                        </>
                    ) : (
                        <>
                            <button className="btn-new">+ New</button>
                            <button>🍽 QR Orders</button>
                            <button>📄 Draft List</button>
                            <button>🪑 Table Order</button>
                        </>
                    )}
                </div>

            </div>

            {/* HERO */}
            <div className="hero-section">
                <div className="hero-content">
                    <h1>
                        {isCustomer
                            ? "Fresh Coffee, Better Day ☕"
                            : "Manage Your Cafe Smarter 🚀"}
                    </h1>

                    <p>
                        {isCustomer
                            ? "Enjoy premium coffee, cozy vibes, and delicious moments every day."
                            : "Track orders, monitor tables, and improve customer experience."}
                    </p>

                    <button className="hero-btn">
                        {isCustomer ? "Explore Menu" : "View Dashboard"}
                    </button>
                </div>

                <div className="hero-image"></div>
            </div>

            {/* TITLE STATS */}
            <div className="section-title">
                <span></span>
                <h2>Today's Highlights</h2>
                <span></span>
            </div>

            {/* SIMPLE REAL DATA */}
            <section className="stats-section">

                <div className="stat-box">
                    <h3>Open</h3>
                    <p>Cafe Status</p>
                </div>

                <div className="stat-box">
                    <h3>08:00</h3>
                    <p>Opening Hour</p>
                </div>

                <div className="stat-box">
                    <h3>22:00</h3>
                    <p>Closing Hour</p>
                </div>

                <div className="stat-box">
                    <h3>Hot Americano</h3>
                    <p>Best Seller Today</p>
                </div>

            </section>

            {/* TITLE MENU */}
            <div className="section-title">
                <span></span>
                <h2>Recommended For You</h2>
                <span></span>
            </div>

            {/* CARDS */}
            <div className="home-cards">

                <div className="home-card">
                    <h3>☕ Americano</h3>
                    <p>Classic bold coffee with rich aroma.</p>
                </div>

                <div className="home-card">
                    <h3>🥐 Croissant</h3>
                    <p>Fresh buttery pastry for your coffee time.</p>
                </div>

                <div className="home-card">
                    <h3>✨ Cozy Space</h3>
                    <p>Comfortable place for study or chill.</p>
                </div>

            </div>
        </>
    );
}

export default HeaderDashboard;
