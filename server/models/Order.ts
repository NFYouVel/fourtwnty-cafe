import { Table, Column, Model, DataType, PrimaryKey, BelongsTo, CreatedAt, UpdatedAt, DeletedAt, HasMany } from 'sequelize-typescript';
import { Users } from './Users.js';

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
        type: DataType.DECIMAL(10,2),
        allowNull: false,
    })
    total_price!: number;

    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    userId!: string;

    @CreatedAt
    declare createdAt: Date;

    @UpdatedAt
    declare updatedAt: Date;

    @DeletedAt
    declare deletedAt: Date;

    @BelongsTo(() => Users, 'userId')
    user!: Users;
}