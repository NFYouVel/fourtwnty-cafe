import { Sequelize } from 'sequelize-typescript';
import { Users } from '../../models/Users.js';
import { Order } from '../../models/Order.js';
import { Reservation } from '../../models/Reservation.js';
import { TableInformation } from '../../models/TableInformation.js';
import dotenv from 'dotenv';
dotenv.config();

export const sequelize = new Sequelize({
    database: process.env.DB_NAME as string,
    username: process.env.DB_USER as string,
    password: process.env.DB_PASS as string,
    host: process.env.DB_HOST as string,
    dialect: 'postgres',
    models: [Users, Order, Reservation, TableInformation]
});
