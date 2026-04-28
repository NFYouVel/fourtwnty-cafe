import "../styles/receipt.css";

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

interface ReceiptPopupProps {
    order: Order;
    paymentMethod: string;
    onClose: () => void;
}

export default function ReceiptPopup({ order, paymentMethod, onClose }: ReceiptPopupProps) {

    const formatPrice = (price: number) => {
        return "Rp " + price.toLocaleString("id-ID");
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    };

    const formatTime = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    const subtotal = order.orderMenus.reduce(
        (acc, item) => acc + item.menu.price, 0
    );
    
    const total = Number(order.total_price);

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="receipt-overlay">
            <div className="receipt-wrapper">

                {/* RECEIPT */}
                <div className="receipt-card">

                    {/* HEADER */}
                    <div className="receipt-header">
                        <h2>FOURTWNTY CAFÉ</h2>
                        <p>
                            Jl. Coffee Street No. 420
                            <br />
                            Bandung, Indonesia
                            <br />
                            Tel: (022) 420-4200
                        </p>
                    </div>

                    {/* ORDER INFO */}
                    <div className="receipt-info">
                        <div className="receipt-info-row">
                            <span>Order</span>
                            <span>#{order.id.slice(0, 8)}</span>
                        </div>

                        <div className="receipt-info-row">
                            <span>Date</span>
                            <span>{formatDate(order.createdAt)}</span>
                        </div>

                        <div className="receipt-info-row">
                            <span>Time</span>
                            <span>{formatTime(order.createdAt)}</span>
                        </div>

                        <div className="receipt-info-row">
                            <span>Table</span>
                            <span>
                                {order.table.table_number} ({order.table.area})
                            </span>
                        </div>

                        <div className="receipt-info-row">
                            <span>Type</span>
                            <span>{order.order_type}</span>
                        </div>
                    </div>

                    {/* ITEMS */}
                    <div className="receipt-items">
                        <div className="receipt-items-header">
                            <span>Item</span>
                            <span>Price</span>
                        </div>

                        {order.orderMenus.map((item) => (
                            <div key={item.id} className="receipt-item">
                                <div>
                                    <div className="receipt-item-name">
                                        {item.menu.name}
                                    </div>
                                    {item.customization && (
                                        <div className="receipt-item-note">
                                            Note: {item.customization}
                                        </div>
                                    )}
                                </div>
                                <div className="receipt-item-price">
                                    {formatPrice(item.menu.price)}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* TOTALS */}
                    <div className="receipt-totals">
                        <div className="receipt-total-row">
                            <span>Subtotal</span>
                            <span>{formatPrice(subtotal)}</span>
                        </div>

                        <div className="receipt-total-row grand">
                            <span>TOTAL</span>
                            <span>{formatPrice(total)}</span>
                        </div>
                    </div>

                    {/* PAYMENT METHOD */}
                    <div className="receipt-payment">
                        <span>Paid via {paymentMethod}</span>
                    </div>

                    {/* FOOTER */}
                    <div className="receipt-footer">
                        <p className="receipt-thanks">Thank You!</p>
                        <p>
                            We hope you enjoyed your meal.
                            <br />
                            See you again soon ☕
                        </p>
                    </div>
                </div>

                {/* BUTTONS */}
                <div className="receipt-actions">
                    <button
                        className="receipt-print-btn"
                        onClick={handlePrint}
                    >
                        🖨️ Print Receipt
                    </button>

                    <button
                        className="receipt-close-btn"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>

            </div>
        </div>
    );
}