import Header from "../components/Header";
import HeaderDashboard from "../components/HeaderDashboard";
import "../styles/orderMenuList.css";

function OrderMenuListPage() {
    return (
        <>
            <Header />
            <HeaderDashboard />

            <div className="wrapper-order-menu-list">
                {/* LEFT CATEGORY */}
                <div className="section-categorized">
                    <h2 className="category-heading">Category</h2>
                    <div className="category-list">
                        <div className="category-item active">All</div>
                        <div className="category-item">Main</div>
                        <div className="category-item">Appetizer</div>
                        <div className="category-item">Side</div>
                        <div className="category-item">Dessert</div>
                        <div className="category-parent">Drink</div>
                        <div className="subcategory-list">
                            <div className="subcategory-item">Coffee</div>
                            <div className="subcategory-item">Non-Coffee</div>
                            <div className="subcategory-item">Other</div>
                        </div>
                    </div>
                </div>

                {/* CENTER MENU */}
                <div className="section-menu">
                </div>

                {/* RIGHT PAYMENT */}
                <div className="section-payment">
                </div>

            </div>
        </>
    );
}

export default OrderMenuListPage;
