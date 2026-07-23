import {
    Table, Column, Model, DataType, PrimaryKey,
    CreatedAt, UpdatedAt, DeletedAt
} from 'sequelize-typescript';
import type { Order } from './Order.js';
import type { Reservation } from './Reservation.js';

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
    declare name: string;

    @Column({
        type: DataType.STRING,
        unique: true,
        allowNull: false,
    })
    declare email: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare password: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare phone: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    declare reset_code: string;

    @Column({
        type: DataType.ENUM('Customer', 'Staff', 'Manager'),
        allowNull: false,
        defaultValue: 'Customer',
    })
    declare user_role: 'Customer' | 'Staff' | 'Manager';

    @CreatedAt
    declare createdAt: Date;
    @UpdatedAt
    declare updatedAt: Date;
    @DeletedAt
    declare deletedAt: Date;

    // Relasi (hanya tipe)
    declare orders?: Order[];
    declare resevations?: Reservation[];
}