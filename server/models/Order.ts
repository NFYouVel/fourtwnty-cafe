import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    CreatedAt,
    UpdatedAt,
    DeletedAt,
    HasMany,
    ForeignKey,
    BelongsTo,
    HasOne,
} from 'sequelize-typescript';

import { Users } from './Users.js';
import { OrderMenu } from './OrderMenu.js';
import { TableInformation } from './TableInformation.js';
import { Payment } from './Payment.js';

@Table({
    tableName: 'Order',
    timestamps: true,
    paranoid: true,
})
export class Order extends Model {

    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        allowNull: false,
    })
    declare id: string;

    @Column({
        type: DataType.ENUM('Dine-in', 'Takeaway'),
        allowNull: false,
    })
    order_type!: 'Dine-in' | 'Takeaway';

    @Column({
        type: DataType.ENUM('Process', 'Cancelled', 'Closed'),
        allowNull: false,
        defaultValue: 'Process',
    })
    status!: 'Process' | 'Cancelled' | 'Closed';

    @Column({
        type: DataType.DECIMAL(10, 2),
        allowNull: false,
    })
    total_price!: number;

    // 👇 USER RELATION
    @ForeignKey(() => Users)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    userId!: string;

    @BelongsTo(() => Users)
    user!: Users;

    // 👇 TABLE RELATION
    @ForeignKey(() => TableInformation)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    tableId!: string;

    @BelongsTo(() => TableInformation)
    table!: TableInformation;

    // 👇 ORDER MENU
    @HasMany(() => OrderMenu)
    orderMenus!: OrderMenu[];

    // 👇 PAYMENT RELATION
    @HasOne(() => Payment, {
        foreignKey: "orderId",
        as: "payment"
    })
    payment!: Payment;

    @CreatedAt
    declare createdAt: Date;

    @UpdatedAt
    declare updatedAt: Date;

    @DeletedAt
    declare deletedAt: Date;
}
