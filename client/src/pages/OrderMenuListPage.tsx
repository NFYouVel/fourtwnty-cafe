import { useEffect, useState } from "react";
import Header from "../components/Header";
import HeaderDashboard from "../components/HeaderDashboard";
import "../styles/orderMenuList.css";
import { getAllMenuRequest } from "../services/api";
import type { Menu } from "../type/menuAttribute";

import { useAppDispatch } from "../hooks/useAppDispatch";
import { menuAction } from "../hooks/menuSlice";

function OrderMenuListPage() {
    const [menu, setMenu] = useState<Menu[]>([]);
    const [selectedCategory, setSelectedCategory] = useState("All");

    const dispatch = useAppDispatch();

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const data: Menu[] = await getAllMenuRequest();
                dispatch(menuAction.setMenu(data));
                setMenu(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchMenu();
    }, [dispatch]);

    /* FILTER MENU */
    const filteredMenu = menu.filter((item) => {
        if (selectedCategory === "All") return true;

        if (selectedCategory === "Coffee") {
            return item.drink_category === "Coffee";
        }

        if (selectedCategory === "Non-Coffee") {
            return item.drink_category === "Non-Coffee";
        }

        if (selectedCategory === "Other") {
            return item.drink_category === "Other";
        }

        return item.category === selectedCategory;
    });

    return (
        <>
            <Header />
            <HeaderDashboard />

            <div className="wrapper-order-menu-list">

                {/* LEFT CATEGORY */}
                <div className="section-categorized">
                    <h2 className="category-heading">Category</h2>

                    <div className="category-list">

                        <div
                            className={`category-item ${selectedCategory === "All"
                                    ? "active"
                                    : ""
                                }`}
                            onClick={() =>
                                setSelectedCategory("All")
                            }
                        >
                            All
                        </div>

                        <div
                            className={`category-item ${selectedCategory === "Main"
                                    ? "active"
                                    : ""
                                }`}
                            onClick={() =>
                                setSelectedCategory("Main")
                            }
                        >
                            Main
                        </div>

                        <div
                            className={`category-item ${selectedCategory === "Appetizer"
                                    ? "active"
                                    : ""
                                }`}
                            onClick={() =>
                                setSelectedCategory(
                                    "Appetizer"
                                )
                            }
                        >
                            Appetizer
                        </div>

                        <div
                            className={`category-item ${selectedCategory === "Side"
                                    ? "active"
                                    : ""
                                }`}
                            onClick={() =>
                                setSelectedCategory("Side")
                            }
                        >
                            Side
                        </div>

                        <div
                            className={`category-item ${selectedCategory === "Dessert"
                                    ? "active"
                                    : ""
                                }`}
                            onClick={() =>
                                setSelectedCategory(
                                    "Dessert"
                                )
                            }
                        >
                            Dessert
                        </div>

                        <div className="category-parent">
                            Drink
                        </div>

                        <div className="subcategory-list">

                            <div
                                className={`subcategory-item ${selectedCategory ===
                                        "Coffee"
                                        ? "active"
                                        : ""
                                    }`}
                                onClick={() =>
                                    setSelectedCategory(
                                        "Coffee"
                                    )
                                }
                            >
                                Coffee
                            </div>

                            <div
                                className={`subcategory-item ${selectedCategory ===
                                        "Non-Coffee"
                                        ? "active"
                                        : ""
                                    }`}
                                onClick={() =>
                                    setSelectedCategory(
                                        "Non-Coffee"
                                    )
                                }
                            >
                                Non-Coffee
                            </div>

                            <div
                                className={`subcategory-item ${selectedCategory ===
                                        "Other"
                                        ? "active"
                                        : ""
                                    }`}
                                onClick={() =>
                                    setSelectedCategory(
                                        "Other"
                                    )
                                }
                            >
                                Other
                            </div>

                        </div>
                    </div>
                </div>

                {/* CENTER MENU */}
                <div className="section-menu">
                    <h2 className="menu-heading">
                        Menu List
                    </h2>

                    <div className="menu-grid">
                        {filteredMenu.map((item) => (
                            <div
                                className="menu-card"
                                key={item.id}
                            >
                                <h3>{item.name}</h3>

                                <p className="menu-category">
                                    {item.category}
                                    {item.drink_category &&
                                        ` > ${item.drink_category}`}
                                </p>

                                <p className="menu-description">
                                    {item.description}
                                </p>

                                <span className="menu-price">
                                    Rp{" "}
                                    {item.price.toLocaleString(
                                        "id-ID"
                                    )}
                                </span>
                            </div>
                        ))}

                        {filteredMenu.length === 0 && (
                            <p>
                                No menu found in this
                                category.
                            </p>
                        )}
                    </div>
                </div>

                {/* RIGHT PAYMENT */}
                <div className="section-payment">
                    <h2 className="payment-title">
                        Current Order
                    </h2>
                </div>

            </div>
        </>
    );
}

export default OrderMenuListPage;
