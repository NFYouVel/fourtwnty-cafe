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
    // Users ↔ Order
    Users.hasMany(Order, { foreignKey: 'userId' });
    Order.belongsTo(Users, { foreignKey: 'userId' });

    // Users ↔ Reservation
    Users.hasMany(Reservation, { foreignKey: 'userId' });
    Reservation.belongsTo(Users, { foreignKey: 'userId' });

    // TableInformation ↔ Order
    TableInformation.hasMany(Order, { foreignKey: 'tableId' });
    Order.belongsTo(TableInformation, { foreignKey: 'tableId' });

    // TableInformation ↔ Reservation
    TableInformation.hasMany(Reservation, { foreignKey: 'tableId' });
    Reservation.belongsTo(TableInformation, { foreignKey: 'tableId' });

    // Order ↔ OrderMenu
    Order.hasMany(OrderMenu, { foreignKey: 'orderId' });
    OrderMenu.belongsTo(Order, { foreignKey: 'orderId' });

    // Menu ↔ OrderMenu
    Menu.hasMany(OrderMenu, { foreignKey: 'menuId' });
    OrderMenu.belongsTo(Menu, { foreignKey: 'menuId' });

    // Order ↔ Payment
    Order.hasOne(Payment, { foreignKey: 'orderId' });
    Payment.belongsTo(Order, { foreignKey: 'orderId' });

    // Menu ↔ MenuIngredient
    Menu.hasMany(MenuIngredient, { foreignKey: 'menuId' });
    MenuIngredient.belongsTo(Menu, { foreignKey: 'menuId' });

    // Stock ↔ MenuIngredient
    Stock.hasMany(MenuIngredient, { foreignKey: 'stockId' });
    MenuIngredient.belongsTo(Stock, { foreignKey: 'stockId' });
}