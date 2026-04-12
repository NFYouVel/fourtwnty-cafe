import "../styles/headerDashboard.css";

function HeaderDashboard() {
    return (
        <div className="wrapper-dashboard-header">
            {/* Left */}
            <div className="dashboard-left">

                <div className="profile-info">
                    <h4>Saiful Talukdar</h4>
                    <p>Staff</p>
                </div>

                <div className="divider"></div>

                <div className="dashboard-title">
                    <h2>Point of Sale (POS)</h2>
                    <span>Dashboard Menu</span>
                </div>
            </div>

            {/* Right */}
            <div className="dashboard-right">
                <button className="btn-new">+ New</button>
                <button className="btn-menu">🍽 QR Menu Orders</button>
                <button className="btn-menu">📄 Draft List</button>
                <button className="btn-menu">🪑 Table Order</button>
            </div>
        </div>
    );
}

export default HeaderDashboard;
