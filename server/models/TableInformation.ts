import { Table, Column, Model, DataType, PrimaryKey, BelongsTo, CreatedAt, UpdatedAt, DeletedAt, HasMany } from 'sequelize-typescript';
import { Order } from './Order.js';
import { Reservation } from './Reservation.js';

@Table({
    tableName: 'TableInformation',
    timestamps: true,
    paranoid: true,
})
export class TableInformation extends Model {
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        allowNull: false,
    })
    declare id: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    table_number!: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    seat_count!: number;

    @Column({
        type: DataType.ENUM('Indoor', 'Outdoor'),
        allowNull: false,
    })
    area!: 'Indoor' | 'Outdoor';

    @Column({
        type: DataType.ENUM('Unavailable', 'Available'),
        allowNull: false,
    })
    status!: 'Unavailable' | 'Available';

    @CreatedAt
    declare createdAt: Date;

    @UpdatedAt
    declare updatedAt: Date;

    @DeletedAt
    declare deletedAt: Date;

    //di userId ini bakal cari data (bisa lebih dari 1) di table Order
    @HasMany(() => Order, 'tableId') //1 userid bisa punya banyak order[]
    order!: Order[];

    @HasMany(() => Reservation, 'tableId')
    reservation!: Reservation[];
}