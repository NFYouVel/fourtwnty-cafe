export type Stock = {
    id: string;
    ingredient_name: string;
    amount: number;
    unit: 'Gram' | 'Buah' | 'Bungkus' | 'Lembar' | 'Mililiter';
};