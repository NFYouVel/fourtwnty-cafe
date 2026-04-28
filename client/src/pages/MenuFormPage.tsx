import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import type { IngredientItem, StockOption } from "../type/menuAttribute";
import Header from "../components/Header";
import HeaderDashboard from "../components/HeaderDashboard";
import "../styles/menuManagement.css";

const CATEGORIES = ["Main", "Appetizer", "Side", "Dessert", "Drink"] as const;
const DRINK_CATEGORIES = ["Coffee", "Non-Coffee", "Tea", "Frappe", "Juice", "Other"] as const;

export default function MenuFormPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    // Form state
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState<string>("Main");
    const [drinkCategory, setDrinkCategory] = useState<string>("Coffee");
    const [description, setDescription] = useState("");

    // Ingredients
    const [ingredients, setIngredients] = useState<IngredientItem[]>([]);
    const [stockOptions, setStockOptions] = useState<StockOption[]>([]);

    const [loading, setLoading] = useState(false);

    // Fetch available stocks
    useEffect(() => {
        const fetchStocks = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/stock/all`);
                const data = await res.json();
                setStockOptions(data);
            } catch (error) {
                console.error("Error fetching stocks:", error);
            }
        };
        fetchStocks();
    }, []);

    // Fetch menu data if editing
    useEffect(() => {
        if (!id) return;

        const fetchMenu = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/menu/${id}`);
                const data = await res.json();

                setName(data.name);
                setPrice(String(data.price));
                setCategory(data.category);
                setDrinkCategory(data.drink_category || "Coffee");
                setDescription(data.description);

                if (data.menuIngredient) {
                    const mapped: IngredientItem[] = data.menuIngredient.map((ing: any) => ({
                        stockId: ing.stockId,
                        ingredient_name: ing.stock?.ingredient_name || "",
                        unit: ing.stock?.unit || "",
                        jumlah_pemakaian: ing.jumlah_pemakaian
                    }));
                    setIngredients(mapped);
                }
            } catch (error) {
                console.error("Error fetching menu:", error);
            }
        };
        fetchMenu();
    }, [id]);

    // Add ingredient row
    const handleAddIngredient = () => {
        if (stockOptions.length === 0) return;
        setIngredients([
            ...ingredients,
            {
                stockId: stockOptions[0].id,
                ingredient_name: stockOptions[0].ingredient_name,
                unit: stockOptions[0].unit,
                jumlah_pemakaian: 1
            }
        ]);
    };

    // Remove ingredient row
    const handleRemoveIngredient = (index: number) => {
        setIngredients(ingredients.filter((_, i) => i !== index));
    };

    // Update ingredient
    const handleIngredientChange = (index: number, field: string, value: string) => {
        const updated = [...ingredients];

        if (field === "stockId") {
            const selected = stockOptions.find(s => s.id === value);
            updated[index] = {
                ...updated[index],
                stockId: value,
                ingredient_name: selected?.ingredient_name || "",
                unit: selected?.unit || ""
            };
        } else if (field === "jumlah_pemakaian") {
            updated[index] = {
                ...updated[index],
                jumlah_pemakaian: Number(value)
            };
        }

        setIngredients(updated);
    };

    // Submit
    const handleSubmit = async () => {
        if (!name || !price || !description) {
            alert("Please fill all required fields!");
            return;
        }

        setLoading(true);
        try {
            const body = {
                name,
                price: Number(price),
                category,
                drink_category: category === "Drink" ? drinkCategory : null,
                description,
                ingredients: ingredients.map(ing => ({
                    stockId: ing.stockId,
                    jumlah_pemakaian: ing.jumlah_pemakaian
                }))
            };

            const url = isEdit
                ? `${import.meta.env.VITE_API_URL}/api/menu/update/${id}`
                : `${import.meta.env.VITE_API_URL}/api/menu/create`;

            const method = isEdit ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message);

            alert(isEdit ? "Menu updated!" : "Menu created!");
            navigate("/menu");
        } catch (error: unknown) {
            if (error instanceof Error) {
                alert(error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header />
            <HeaderDashboard />

            <div className="menu-form-page">
                <div className="menu-form-card">
                    <h1 className="menu-form-title">
                        {isEdit ? "Edit Menu" : "Create New Menu"}
                    </h1>

                    {/* NAME */}
                    <div className="menu-form-group">
                        <label className="menu-form-label">Menu Name *</label>
                        <input
                            className="menu-form-input"
                            type="text"
                            placeholder="e.g. Burger, Americano..."
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    {/* PRICE + CATEGORY */}
                    <div className="menu-form-row">
                        <div className="menu-form-group">
                            <label className="menu-form-label">Price (Rp) *</label>
                            <input
                                className="menu-form-input"
                                type="number"
                                placeholder="e.g. 25000"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                        </div>

                        <div className="menu-form-group">
                            <label className="menu-form-label">Category *</label>
                            <select
                                className="menu-form-select"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                {CATEGORIES.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* DRINK CATEGORY (conditional) */}
                    {category === "Drink" && (
                        <div className="menu-form-group">
                            <label className="menu-form-label">Drink Category</label>
                            <select
                                className="menu-form-select"
                                value={drinkCategory}
                                onChange={(e) => setDrinkCategory(e.target.value)}
                            >
                                {DRINK_CATEGORIES.map((dc) => (
                                    <option key={dc} value={dc}>{dc}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* DESCRIPTION */}
                    <div className="menu-form-group">
                        <label className="menu-form-label">Description *</label>
                        <textarea
                            className="menu-form-textarea"
                            placeholder="Describe the menu item..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    {/* INGREDIENTS */}
                    <div className="menu-form-ing-section">
                        <h3 className="menu-form-ing-title">🧂 Ingredients (from Stock)</h3>

                        {ingredients.map((ing, index) => (
                            <div key={index} className="menu-form-ing-row">
                                <select
                                    className="menu-form-ing-select"
                                    value={ing.stockId}
                                    onChange={(e) => handleIngredientChange(index, "stockId", e.target.value)}
                                >
                                    {stockOptions.map((stock) => (
                                        <option key={stock.id} value={stock.id}>
                                            {stock.ingredient_name}
                                        </option>
                                    ))}
                                </select>

                                <input
                                    className="menu-form-ing-qty"
                                    type="number"
                                    placeholder="Qty"
                                    value={ing.jumlah_pemakaian}
                                    onChange={(e) => handleIngredientChange(index, "jumlah_pemakaian", e.target.value)}
                                />

                                <span className="menu-form-ing-unit">
                                    {ing.unit}
                                </span>

                                <button
                                    className="menu-form-ing-remove"
                                    onClick={() => handleRemoveIngredient(index)}
                                >
                                    ✕
                                </button>
                            </div>
                        ))}

                        <button
                            className="menu-form-ing-add"
                            onClick={handleAddIngredient}
                        >
                            + Add Ingredient
                        </button>
                    </div>

                    {/* ACTIONS */}
                    <div className="menu-form-actions">
                        <button
                            className="menu-form-submit"
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            {loading
                                ? "Saving..."
                                : isEdit
                                    ? "Update Menu"
                                    : "Create Menu"
                            }
                        </button>

                        <button
                            className="menu-form-cancel"
                            onClick={() => navigate("/menu")}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}