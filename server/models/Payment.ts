import { Table, Column, Model, DataType, PrimaryKey, BelongsTo, CreatedAt, UpdatedAt, DeletedAt, HasMany } from 'sequelize-typescript';
import { Order } from './Order.js'

@Table({
    tableName: 'Payment',
    timestamps: true,
    paranoid: true,
})
export class Payment extends Model {
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        allowNull: false,
    })
    declare id: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
    table_number!: number;

    @Column({
        type: DataType.ENUM('Paid', 'Cancelled'),
        allowNull: false,
    })
    status!: 'Paid' | 'Cancelled';

    @Column({
        type: DataType.UUIDV4,
        allowNull: false,
    })
    orderId!: string;

    @CreatedAt
    declare createdAt: Date;

    @UpdatedAt
    declare updatedAt: Date;

    @DeletedAt
    declare deletedAt: Date;

    @BelongsTo(() => Order, 'orderId')
    order!: Order;
}