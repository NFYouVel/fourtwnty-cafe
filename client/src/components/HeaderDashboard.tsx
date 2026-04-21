import "../styles/headerDashboard.css";
import { useSelector } from "react-redux";
import type { RootState } from "../hooks/store";
import { useState } from "react";
import { useNavigate } from "react-router";
// import { Link } from "react-router";

function HeaderDashboard() {
    const user = useSelector((state: RootState) => state.auth.user);
    const isCustomer = user?.user_role === "Customer";

    const [openMenu, setOpenMenu] = useState(false);

    // popup staff
    const [showPopup, setShowPopup] = useState(false);
    const [tableNumber, setTableNumber] = useState("");
    const navigate = useNavigate();

    const handleNewOrder = () => {
        setShowPopup(true);
    };

    const handleStartOrder = () => {
        if (!tableNumber) {
            alert("Input table number first");
            return;
        }

        localStorage.setItem("tableNumber", tableNumber);
        setShowPopup(false)
        navigate("/menu-list/" + tableNumber)

    };

    return (
        <>
            {/* POPUP STAFF */}
            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup-box">
                        <h2>New Order</h2>

                        <input
                            type="number"
                            placeholder="Input Table Number"
                            value={tableNumber}
                            onChange={(e) =>
                                setTableNumber(e.target.value)
                            }
                        />

                        <button onClick={handleStartOrder}>
                            Start Order
                        </button>

                        <button
                            onClick={() => setShowPopup(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

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
                        {/* ganti yg ini */}
                            <button className="btn-new">🛒 Order Now</button> 
                            <button>☕ Coffee Menu</button>
                            <button>🍰 Desserts</button>
                            <button>⭐ Favorites</button>
                        </>
                    ) : (
                        <>
                            <button
                                className="btn-new"
                                onClick={handleNewOrder}
                            >
                                + New Order
                            </button>

                            <button>📄 Order List</button>
                            <button>Table Status</button>
                        </>
                    )}
                </div>

            </div>

            {/* HERO CUSTOMER */}
            {isCustomer && (
                <>
                    <div className="hero-section">
                        <div className="hero-content">
                            <h1>Fresh Coffee, Better Day ☕</h1>

                            <p>
                                Enjoy premium coffee, cozy vibes,
                                and delicious moments every day.
                            </p>

                            <button className="hero-btn">
                                Explore Menu
                            </button>
                        </div>

                        <div className="hero-image"></div>
                    </div>
                </>
            )}
        </>
    );
}

export default HeaderDashboard;
