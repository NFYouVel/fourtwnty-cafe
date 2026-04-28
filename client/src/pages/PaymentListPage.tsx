import { useEffect, useState } from "react";
import Header from "../components/Header";
import HeaderDashboard from "../components/HeaderDashboard";
import { getAllProcessOrder, updatePaymentOrder } from "../services/api";

import "../styles/paymentList.css";

/* TYPES */
type Menu = {
    id: string;
    name: string;
    price: number;
};

type OrderMenu = {
    id: string;
    customization: string;
    menuId: string;
    menu: Menu;
};

type Table = {
    id: string;
    table_number: number;
    area: string;
};

type Payment = {
    id: string;
    status: string;
    method: string | null;
};

type Order = {
    id: string;
    order_type: string;
    status: string;
    total_price: string;
    createdAt: string;
    orderMenus: OrderMenu[];
    payment: Payment;
    table: Table;
};

type PaymentMethod = "Cash" | "QRIS" | "Card";

function PaymentListPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("Cash");

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const data: Order[] = await getAllProcessOrder();

                setOrders(data);

                if (data.length > 0) {
                    setSelectedOrder(data[0]);
                }

            } catch (error) {
                console.error(error);
            }
        };

        fetchOrder();
    }, []);

    const handleConfirmPayment = async () => {
        if (!selectedOrder) return;

        try {
            await updatePaymentOrder(selectedOrder.id, paymentMethod);
            alert("Payment Berhasil!")

            const updatedOrders = orders.filter(
                (item) => item.id !== selectedOrder.id
            );

            setOrders(updatedOrders);

            /* pilih order berikutnya */
            if (updatedOrders.length > 0) {
                setSelectedOrder(updatedOrders[0]);
            } else {
                setSelectedOrder(null);
            }

        } catch (error) {
            console.log(error);
        }
    };



    return (
        <>
            <Header />
            <HeaderDashboard />

            <div className="payment-page">

                {/* LEFT SIDE */}
                <div className="payment-list-box">

                    <div className="section-head">
                        <h2>Pending Payment</h2>
                        <span>{orders.length} Orders</span>
                    </div>

                    <div className="payment-list">

                        {orders.map((item) => (
                            <div
                                key={item.id}
                                className={`payment-card ${selectedOrder?.id === item.id
                                    ? "active"
                                    : ""
                                    }`}
                                onClick={() =>
                                    setSelectedOrder(item)
                                }
                            >
                                <div>
                                    <h3>
                                        #{item.id.slice(0, 8)}
                                    </h3>

                                    <p>
                                        Table{" "}
                                        {item.table.table_number}
                                        {" • "}
                                        {item.order_type}
                                    </p>
                                </div>

                                <div className="payment-price">
                                    Rp{" "}
                                    {Number(
                                        item.total_price
                                    ).toLocaleString("id-ID")}
                                </div>
                            </div>
                        ))}

                    </div>
                </div>

                {/* RIGHT SIDE */}
                <div className="payment-detail-box">

                    {selectedOrder && (
                        <>
                            {/* ORDER DETAIL */}
                            <div className="detail-card">
                                <h2>Order Detail</h2>

                                <div className="detail-row">
                                    <span>Order ID</span>
                                    <span>
                                        #
                                        {selectedOrder.id.slice(
                                            0,
                                            8
                                        )}
                                    </span>
                                </div>

                                <div className="detail-row">
                                    <span>Table</span>
                                    <span>
                                        {
                                            selectedOrder.table
                                                .table_number
                                        }
                                    </span>
                                </div>

                                <div className="detail-row">
                                    <span>Area</span>
                                    <span>
                                        {
                                            selectedOrder.table
                                                .area
                                        }
                                    </span>
                                </div>

                                <div className="detail-row">
                                    <span>Type</span>
                                    <span>
                                        {
                                            selectedOrder.order_type
                                        }
                                    </span>
                                </div>

                                <div className="detail-row total">
                                    <span>Total</span>
                                    <span>
                                        Rp{" "}
                                        {Number(
                                            selectedOrder.total_price
                                        ).toLocaleString(
                                            "id-ID"
                                        )}
                                    </span>
                                </div>
                            </div>

                            {/* ORDERED MENU */}
                            <div className="detail-card">
                                <h2>Ordered Menu</h2>

                                <div className="ordered-menu-list">

                                    {selectedOrder.orderMenus.map(
                                        (item) => (
                                            <div
                                                key={item.id}
                                                className="ordered-item"
                                            >
                                                <div>
                                                    <h4>
                                                        {
                                                            item
                                                                .menu
                                                                .name
                                                        }
                                                    </h4>

                                                    <p>
                                                        {item.customization ||
                                                            "No Note"}
                                                    </p>
                                                </div>

                                                <span>
                                                    Rp{" "}
                                                    {item.menu.price.toLocaleString(
                                                        "id-ID"
                                                    )}
                                                </span>
                                            </div>
                                        )
                                    )}

                                </div>
                            </div>

                            {/* PAYMENT METHOD */}
                            <div className="detail-card">
                                <h2>Payment Method</h2>

                                <div className="method-grid">

                                    <div
                                        className={`method ${paymentMethod ===
                                            "Cash"
                                            ? "active"
                                            : ""
                                            }`}
                                        onClick={() =>
                                            setPaymentMethod(
                                                "Cash"
                                            )
                                        }
                                    >
                                        Cash
                                    </div>

                                    <div
                                        className={`method ${paymentMethod ===
                                            "QRIS"
                                            ? "active"
                                            : ""
                                            }`}
                                        onClick={() =>
                                            setPaymentMethod(
                                                "QRIS"
                                            )
                                        }
                                    >
                                        QRIS
                                    </div>

                                    <div
                                        className={`method ${paymentMethod ===
                                            "Card"
                                            ? "active"
                                            : ""
                                            }`}
                                        onClick={() =>
                                            setPaymentMethod(
                                                "Card"
                                            )
                                        }
                                    >
                                        Card
                                    </div>

                                </div>
                            </div>

                            {/* ACTION */}
                            <div className="detail-card">
                                <button
                                    className="btn primary"
                                    onClick={
                                        handleConfirmPayment
                                    }
                                >
                                    Confirm Payment
                                </button>

                                <button className="btn secondary">
                                    Print Receipt
                                </button>
                            </div>
                        </>
                    )}

                </div>
            </div>
        </>
    );
}

export default PaymentListPage;
