import { Table, Column, Model, DataType, PrimaryKey, BelongsTo, CreatedAt, UpdatedAt, DeletedAt, HasMany } from 'sequelize-typescript';
import { Menu } from './Menu.js';
import { Order } from './Order.js';

@Table({
    tableName: 'Junction_orderMenu',
    timestamps: true,
    paranoid: true,
})
export class OrderMenu extends Model {
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        allowNull: false,
    })
    declare id: string;

    @Column({
        type: DataType.UUIDV4,
        allowNull: false,
    })
    orderId!: string;

    @Column({
        type: DataType.UUIDV4,
        allowNull: false,
    })
    menuId!: string;

    @CreatedAt
    declare createdAt: Date;

    @UpdatedAt
    declare updatedAt: Date;

    @DeletedAt
    declare deletedAt: Date;

    @BelongsTo(() => Order, 'orderId')
    order!: Order;

    @BelongsTo(() => Menu, 'menuId')
    menu!: Menu;
}