import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    CreatedAt,
    UpdatedAt,
    DeletedAt,
    ForeignKey,
    BelongsTo,
} from 'sequelize-typescript';

import { Order } from './Order.js';

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
        type: DataType.ENUM('Unpaid', 'Paid', 'Cancelled'),
        allowNull: false,
        defaultValue: 'Unpaid',
    })
    status!: 'Unpaid' | 'Paid' | 'Cancelled';

    @Column({
        type: DataType.ENUM('Cash', 'QRIS', 'Card'),
        allowNull: true,
    })
    method!: 'Cash' | 'QRIS' | 'Card';

    // 👇 FOREIGN KEY
    @ForeignKey(() => Order)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    orderId!: string;

    // 👇 RELATION BACK TO ORDER
    @BelongsTo(() => Order)
    order!: Order;

    @CreatedAt
    declare createdAt: Date;

    @UpdatedAt
    declare updatedAt: Date;

    @DeletedAt
    declare deletedAt: Date;
}
