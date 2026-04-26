import "../styles/headerDashboard.css";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router";

function HeaderDashboard() {
    const user = JSON.parse(localStorage.getItem("userData") || "null");

    const isCustomer = user?.user_role === "Customer";
    const isManager = user?.user_role === "Manager";

    const [openMenu, setOpenMenu] = useState(false);
    const [showTablePopup, setShowTablePopup] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();

    const [tableNumber, setTableNumber] = useState("");

    const handleNewOrder = () => {
        setShowTablePopup(true);
    };

    const handleStartOrder = () => {
        if (!tableNumber) {
            alert("Input table number first");
            return;
        }

        localStorage.setItem("tableNumber", tableNumber);
        setShowTablePopup(false);

        navigate("/menu-list/" + tableNumber);
    };

    return (
        <>
            {/* POPUP */}
            {showTablePopup && (
                <div className="popup-overlay">
                    <div className="popup-box">
                        <h2>Add The Table Number</h2>

                        <input
                            type="number"
                            placeholder="Input Table Number"
                            value={tableNumber}
                            onChange={(e) =>
                                setTableNumber(e.target.value)
                            }
                        />

                        <div className="popup-actions">
                            <button
                                onClick={() =>
                                    setShowTablePopup(false)
                                }
                            >
                                Cancel
                            </button>

                            <button onClick={handleStartOrder}>
                                Start Order
                            </button>
                        </div>
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
                                <span>
                                    Welcome back! Ready for today?
                                </span>
                            </>
                        ) : isManager ? (
                            <>
                                <h2>Manager Dashboard</h2>
                                <span>
                                    Monitor your cafe performance.
                                </span>
                            </>
                        ) : (
                            <>
                                <h2>Welcome to Twntiers Café</h2>
                                <span>
                                    Manage your store beautifully.
                                </span>
                            </>
                        )}
                    </div>

                </div>

                {/* BURGER */}
                <div
                    className="burger-menu"
                    onClick={() =>
                        setOpenMenu(!openMenu)
                    }
                >
                    ☰
                </div>

                {/* RIGHT MENU */}
                <div
                    className={`dashboard-right ${openMenu ? "active-menu" : ""
                        }`}
                >
                    {isCustomer ? (
                        <>
                            <button
                                className="btn-new"
                                onClick={() =>
                                    navigate("/menu-list")
                                }
                            >
                                Coffee Menu
                            </button>

                            <button
                                onClick={() =>
                                    navigate("/reservation")
                                }
                            >
                                Booking Table
                            </button>

                            <button onClick={() => navigate("/reservation/myReservation")}>
                                My Reservation
                            </button>
                        </>
                    ) : isManager ? (
                        <>
                            <button
                                onClick={() =>
                                    navigate("/staff")
                                }
                            >
                                Staff
                            </button>

                            <button
                                onClick={() =>
                                    navigate("/stock")
                                }
                            >
                                Stock
                            </button>

                            <button
                                onClick={() =>
                                    navigate("/tableInformation")
                                }
                            >
                                Table Information
                            </button>

                            {/* <button
                                onClick={() =>
                                    navigate("/staff/listReservation")
                                }
                            >
                                List Reservation Table
                            </button> */}
                        </>
                    ) : (
                        <>
                            <button
                                className="btn-new"
                                onClick={handleNewOrder}
                            >
                                + New Order
                            </button>

                            <button onClick={() => navigate("/payment-list")}>
                                📄 Order List
                            </button>

                            <button onClick={() => navigate("/table-status")}>
                                Table Status
                            </button>
                            <button
                                onClick={() =>
                                    navigate("/staff/listReservation")
                                }
                            >
                                List Reservation Table
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* HERO CUSTOMER */}
            {isCustomer &&
                location.pathname === "/home" && (
                    <div className="hero-section">
                        <div className="hero-content">
                            <h1>
                                Fresh Coffee, Better Day ☕
                            </h1>

                            <p>
                                Enjoy premium coffee,
                                cozy vibes, and delicious
                                moments every day.
                            </p>

                            <button
                                className="hero-btn"
                                onClick={() =>
                                    navigate("/menu-list")
                                }
                            >
                                Explore Menu
                            </button>
                        </div>

                        <div className="hero-image"></div>
                    </div>
                )}
        </>
    );
}

export default HeaderDashboard;
