import type { Menu } from "./menuAttribute";

export type OrderItem = {
    menuId: Menu["id"];
    quantity: number;
    customization: string;
    name: string;
    price: number;
    tableId: number;
    userId: string;
};

