import { useEffect, useState } from "react";
import Header from "../components/Header";
import HeaderDashboard from "../components/HeaderDashboard";
import "../styles/orderMenuList.css";
import { getAllMenuRequest } from "../services/api";

function OrderMenuListPage() {

    const [menu, setMenu] = useState<any[]>([]);

    useEffect(() => {
        fetchMenu();
    }, []);

    const fetchMenu = async () => {
        try {
            const data = await getAllMenuRequest();
            setMenu(data);
        } catch (error) {
            console.error(error);
        }
    };

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
                    <h2 className="menu-heading">Menu List</h2>
                    <div className="menu-grid">
                        {menu.map((item) => (
                            <div className="menu-card" key={item.id}>
                                <h3>{item.name}</h3>
                                <p className="menu-category">
                                    {item.categorized}
                                    {item.drink_categorized &&
                                        ` > ${item.drink_categorized}`}
                                </p>
                                <p className="menu-description">
                                    {item.description}
                                </p>
                                <span className="menu-price">
                                    Rp {item.price.toLocaleString("id-ID")}
                                </span>

                            </div>
                        ))}

                    </div>

                </div>

                {/* RIGHT PAYMENT */}
<div className="section-payment">

    <h2 className="payment-title">Current Order</h2>

    <div className="payment-order-list">

        <div className="payment-item">
            <div>
                <h4>Americano</h4>
                <p>1 x Rp 25.000</p>
            </div>

            <span>Rp 25.000</span>
        </div>

        <div className="payment-item">
            <div>
                <h4>French Fries</h4>
                <p>2 x Rp 30.000</p>
            </div>

            <span>Rp 60.000</span>
        </div>

        <div className="payment-item">
            <div>
                <h4>Ice Chocolate</h4>
                <p>1 x Rp 30.000</p>
            </div>

            <span>Rp 30.000</span>
        </div>

    </div>

    <div className="payment-summary">

        <div className="summary-row">
            <p>Subtotal</p>
            <span>Rp 115.000</span>
        </div>

        <div className="summary-row">
            <p>Tax</p>
            <span>Rp 11.500</span>
        </div>

        <div className="summary-row total">
            <p>Total</p>
            <span>Rp 126.500</span>
        </div>

    </div>

    <button className="checkout-button">
        Checkout
    </button>

</div>


            </div>
        </>
    );
}

export default OrderMenuListPage;
