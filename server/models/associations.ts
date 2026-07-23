// models/associations.ts
import { Users } from './Users.js';
import { Order } from './Order.js';
import { OrderMenu } from './OrderMenu.js';
import { Menu } from './Menu.js';
import { MenuIngredient } from './MenuIngredient.js';
import { Stock } from './Stock.js';
import { Reservation } from './Reservation.js';
import { TableInformation } from './TableInformation.js';
import { Payment } from './Payment.js';

export function defineAssociations() {
    // ─── Users → Order ───
    Users.hasMany(Order, {
        foreignKey: 'userId',
        as: 'orders',
    });
    Order.belongsTo(Users, {
        foreignKey: 'userId',
        as: 'user',
    });

    // ─── Users → Reservation ───
    Users.hasMany(Reservation, {
        foreignKey: 'userId',
        as: 'resevations',
    });
    Reservation.belongsTo(Users, {
        foreignKey: 'userId',
        as: 'user',
    });

    // ─── TableInformation → Order ───
    TableInformation.hasMany(Order, {
        foreignKey: 'tableId',
        as: 'order',
    });
    Order.belongsTo(TableInformation, {
        foreignKey: 'tableId',
        as: 'table',
    });

    // ─── TableInformation → Reservation ───
    TableInformation.hasMany(Reservation, {
        foreignKey: 'tableId',
        as: 'reservation',
    });
    Reservation.belongsTo(TableInformation, {
        foreignKey: 'tableId',
        as: 'tableInformation',
    });

    // ─── Order → OrderMenu ───
    Order.hasMany(OrderMenu, {
        foreignKey: 'orderId',
        as: 'orderMenus',
    });
    OrderMenu.belongsTo(Order, {
        foreignKey: 'orderId',
        as: 'order',
    });

    // ─── Menu → OrderMenu ───
    Menu.hasMany(OrderMenu, {
        foreignKey: 'menuId',
        as: 'orderMenus',
    });
    OrderMenu.belongsTo(Menu, {
        foreignKey: 'menuId',
        as: 'menu',
    });

    // ─── Order → Payment ───
    Order.hasOne(Payment, {
        foreignKey: 'orderId',
        as: 'payment',
    });
    Payment.belongsTo(Order, {
        foreignKey: 'orderId',
        as: 'order',
    });

    // ─── Menu ↔ MenuIngredient ───
    // ❗ TANPA `as` agar cocok dengan `include` di controller (yang menggunakan nama model)
    Menu.hasMany(MenuIngredient, {
        foreignKey: 'menuId',
    });
    MenuIngredient.belongsTo(Menu, {
        foreignKey: 'menuId',
    });

    // ─── Stock ↔ MenuIngredient ───
    // ❗ TANPA `as` agar cocok dengan `include` di controller (yang menggunakan nama model)
    Stock.hasMany(MenuIngredient, {
        foreignKey: 'stockId',
    });
    MenuIngredient.belongsTo(Stock, {
        foreignKey: 'stockId',
    });
}