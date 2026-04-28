import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import type { MenuData } from "../type/menuAttribute";
import Header from "../components/Header";
import HeaderDashboard from "../components/HeaderDashboard";
import "../styles/menuManagement.css";

export default function MenuManagementPage() {
    const [menus, setMenus] = useState<MenuData[]>([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const fetchMenus = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/menu/all`);
            const data = await res.json();
            setMenus(data);
        } catch (error) {
            console.error("Error fetching menus:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMenus();
    }, []);

    const handleDelete = async (id: string) => {
        if (window.confirm("Yakin hapus menu ini?")) {
            try {
                await fetch(`${import.meta.env.VITE_API_URL}/api/menu/delete/${id}`, {
                    method: "DELETE"
                });
                fetchMenus();
            } catch (error) {
                console.error("Error deleting menu:", error);
            }
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(price);
    };

    return (
        <>
            <Header />
            <HeaderDashboard />

            <div className="menu-mgmt-page">
                <div className="menu-mgmt-header">
                    <h1 className="menu-mgmt-title">Menu Management</h1>
                    <button
                        className="menu-mgmt-add-btn"
                        onClick={() => navigate("/menu/create")}
                    >
                        + Add Menu
                    </button>
                </div>

                <div className="menu-mgmt-table-wrapper">
                    {loading ? (
                        <div className="menu-mgmt-loading">
                            <p>Loading...</p>
                        </div>
                    ) : menus.length === 0 ? (
                        <div className="menu-mgmt-empty">
                            <p>No menu items yet. Add one!</p>
                        </div>
                    ) : (
                        <table className="menu-mgmt-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Category</th>
                                    <th>Price</th>
                                    <th>Ingredients</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {menus.map((menu) => (
                                    <tr key={menu.id}>
                                        <td>
                                            <strong>{menu.name}</strong>
                                            <br />
                                            <span style={{ fontSize: 12, color: '#999' }}>
                                                {menu.description}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`menu-mgmt-badge ${menu.category.toLowerCase()}`}>
                                                {menu.category}
                                            </span>
                                            {menu.drink_category && (
                                                <span className="menu-mgmt-badge drink" style={{ marginLeft: 4 }}>
                                                    {menu.drink_category}
                                                </span>
                                            )}
                                        </td>
                                        <td>{formatPrice(menu.price)}</td>
                                        <td>
                                            <div className="menu-mgmt-ingredients">
                                                {menu.menuIngredient?.map((ing) => (
                                                    <span key={ing.id} className="menu-mgmt-ing-tag">
                                                        {ing.stock?.ingredient_name} ({ing.jumlah_pemakaian} {ing.stock?.unit})
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="menu-mgmt-actions">
                                                <button
                                                    className="menu-mgmt-edit-btn"
                                                    onClick={() => navigate(`/menu/update/${menu.id}`)}
                                                >
                                                    ✏️ Edit
                                                </button>
                                                <button
                                                    className="menu-mgmt-delete-btn"
                                                    onClick={() => handleDelete(menu.id)}
                                                >
                                                    🗑️ Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </>
    );
}