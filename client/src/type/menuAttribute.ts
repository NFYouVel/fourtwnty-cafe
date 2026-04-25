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
