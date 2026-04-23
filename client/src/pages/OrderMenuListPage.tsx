import { useEffect, useState } from "react";
import Header from "../components/Header";
import HeaderDashboard from "../components/HeaderDashboard";
import "../styles/orderMenuList.css";
import { createNewOrder, getAllMenuRequest } from "../services/api";
import type { Menu } from "../type/menuAttribute";

import { useAppDispatch } from "../hooks/useAppDispatch";
import { menuAction } from "../hooks/menuSlice";
import type { OrderItem } from "../type/OrderItem";

import { useParams, useNavigate } from "react-router";


function OrderMenuListPage() {

    const user = JSON.parse(localStorage.getItem("userData") || "null");
    const isCustomer = user?.user_role === "Customer";

    const [menu, setMenu] = useState<Menu[]>([]);
    const [selectedCategory, setSelectedCategory] = useState("All");

    const [orders, setOrders] = useState<OrderItem[]>([]);
    const [selectedItem, setSelectedItem] = useState<Menu | null>(null);
    const [noteInput, setNoteInput] = useState("");
    const [showPopup, setShowPopup] = useState(false);

    const { tableNumber } = useParams();
    const [showTablePopup, setShowTablePopup] = useState(false);
    const [inputTable, setInputTable] = useState("");

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

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

    const handleAddMenu = (item: Menu) => {
        setSelectedItem(item);
        setNoteInput("");

        if (tableNumber === undefined) {
            setShowTablePopup(true);
            return;
        }

        setShowPopup(true);
    };

    const handleStartOrder = () => {
        if (!inputTable) {
            alert("Input table number first");
            return;
        }

        setShowTablePopup(false);
        setInputTable("");

        navigate("/menu-list/" + inputTable);
    };

 const handleCreateOrder = async () => {
    try {
        await createNewOrder(orders);
        localStorage.removeItem(`table_order_${tableNumber}`);
        setOrders([]);
        
        alert("Pesanan berhasil dikirim ke dapur!");
        console.log("Order submitted and local data cleared.");

    } catch (error: any) {
        alert("Gagal mengirim pesanan: " + error.message);
    }
}

    const confirmAddMenu = () => {
        if (!selectedItem) return;

        const existingIndex = orders.findIndex(
            (order) =>
                order.menuId === selectedItem.id &&
                order.customization === noteInput
        );

        if (existingIndex !== -1) {
            const updated = [...orders];
            updated[existingIndex].quantity += 1;
            setOrders(updated);
        } else {
            setOrders([
                ...orders,
                {
                    name: selectedItem.name,
                    price: selectedItem.price,
                    menuId: selectedItem.id,
                    quantity: 1,
                    customization: noteInput,
                    tableId: Number(tableNumber),
                    userId: user.id
                }
            ]);

        }

        setShowPopup(false);
    };

    const increaseQty = (index: number) => {
        const updated = [...orders];
        updated[index].quantity += 1;
        setOrders(updated);
    };

    const decreaseQty = (index: number) => {
        const updated = [...orders];

        if (updated[index].quantity === 1) {
            updated.splice(index, 1);
        } else {
            updated[index].quantity -= 1;
        }

        setOrders(updated);
    };

    const totalPrice = orders.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );


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
                                onClick={
                                    !isCustomer
                                        ? () => handleAddMenu(item)
                                        : undefined
                                }
                                style={{
                                    cursor: isCustomer
                                        ? "default"
                                        : "pointer"
                                }}
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
                                    {item.price.toLocaleString("id-ID")}
                                </span>
                            </div>
                        ))}

                        {filteredMenu.length === 0 && (
                            <p>
                                No menu found in this category.
                            </p>
                        )}
                    </div>
                </div>


                {/* RIGHT PAYMENT */}
                {!isCustomer && (
                    <div className="section-payment">

                        <h2 className="payment-title">
                            Current Order
                        </h2>

                        <div className="payment-order-list">

                            {orders.map((item, index) => (
                                <div
                                    className="payment-item"
                                    key={index}
                                >
                                    <div>
                                        <h4>{item.name}</h4>

                                        <p>
                                            {item.customization || "No Note"}
                                        </p>

                                        <p>
                                            Rp{" "}
                                            {item.price.toLocaleString("id-ID")}
                                        </p>
                                    </div>

                                    <div className="qty-box">
                                        <button
                                            onClick={() =>
                                                decreaseQty(index)
                                            }
                                        >
                                            -
                                        </button>

                                        <span>{item.quantity}</span>

                                        <button
                                            onClick={() =>
                                                increaseQty(index)
                                            }
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {orders.length === 0 && (
                                <p>No Order Yet</p>
                            )}

                        </div>

                        <div className="payment-summary">
                            <div className="summary-row total">
                                <span>Total</span>
                                <span>
                                    Rp{" "}
                                    {totalPrice.toLocaleString(
                                        "id-ID"
                                    )}
                                </span>
                            </div>
                        </div>

                        <button
                            className="checkout-button"
                            onClick={() => { handleCreateOrder(); }}
                        >
                            Create Order
                        </button>

                    </div>
                )}

                {showPopup && (
                    <div className="popup-overlay">
                        <div className="popup-box">

                            <h2>Add New Order Menu</h2>

                            <p>
                                {selectedItem?.name}
                            </p>

                            <input
                                type="text"
                                placeholder="Ex: no ice, less spicy..."
                                value={noteInput}
                                onChange={(e) =>
                                    setNoteInput(
                                        e.target.value
                                    )
                                }
                            />

                            <div className="popup-actions">

                                <button
                                    onClick={() =>
                                        setShowPopup(false)
                                    }
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={confirmAddMenu}
                                >
                                    Add Order
                                </button>

                            </div>

                        </div>
                    </div>
                )}

                {showTablePopup && (
                    <div className="popup-overlay">
                        <div className="popup-box">
                            <h2>Add The Table Number</h2>

                            <input
                                type="number"
                                placeholder="Input Table Number"
                                value={inputTable}
                                onChange={(e) =>
                                    setInputTable(e.target.value)
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

            </div>
        </>
    );
}

export default OrderMenuListPage;
