export interface Menu {
    id: string;
    name: string;
    price: number;
    category: string;
    drink_category: string | null;
    description: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
}

export interface IngredientItem {
    stockId: string;
    ingredient_name: string;
    unit: string;
    jumlah_pemakaian: number;
}

export interface MenuData {
    id: string;
    name: string;
    price: number;
    category: 'Main' | 'Appetizer' | 'Side' | 'Dessert' | 'Drink';
    drink_category: 'Coffee' | 'Non-Coffee' | 'Tea' | 'Frappe' | 'Juice' | 'Other' | null;
    description: string;
    menuIngredient?: {
        id: string;
        jumlah_pemakaian: number;
        stockId: string;
        stock: {
            id: string;
            ingredient_name: string;
            unit: string;
        };
    }[];
}

export interface StockOption {
    id: string;
    ingredient_name: string;
    unit: string;
}