import { Table, Column, Model, DataType, PrimaryKey, BelongsTo, CreatedAt, UpdatedAt, DeletedAt, HasMany } from 'sequelize-typescript';
import { Order } from './Order.js';
import { Reservation } from './Reservation.js';

@Table({
    tableName: 'Users',
    timestamps: true,
    paranoid: true,
})
export class Users extends Model {
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        allowNull: false,
    })
    declare id: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    name!: string;

    @Column({
        type: DataType.STRING,
        unique: true,
        allowNull: false,
    })
    email!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    password!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    phone!: string;

    @Column({
        type: DataType.ENUM('Customer', 'Staff', 'Manager'),
        allowNull: false,
        defaultValue: 'Customer',
    })
    user_role!: 'Customer' | 'Staff' | 'Manager';

    @CreatedAt
    declare createdAt: Date;

    @UpdatedAt
    declare updatedAt: Date;

    @DeletedAt
    declare deletedAt: Date;

    //di userId ini bakal cari data (bisa lebih dari 1) di table Order
    @HasMany(() => Order, 'userId') //1 userid bisa punya banyak order[]
    orders! : Order[];

    @HasMany(() => Reservation, 'userId')
    resevations! : Reservation[];
}