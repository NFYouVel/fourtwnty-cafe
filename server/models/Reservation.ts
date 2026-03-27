import { Table, Column, Model, DataType, PrimaryKey, BelongsTo, CreatedAt, UpdatedAt, DeletedAt, HasMany } from 'sequelize-typescript';
import { Users } from './Users.js';
import { Table_Information } from './TableInformation.js';

@Table({
    tableName: 'Reservation',
    timestamps: true,
    paranoid: true,
})
export class Reservation extends Model {
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        allowNull: false,
    })
    declare id: string;

    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    tanggal_reservation!: Date;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    jumlah_orang!: number;

    @Column({
        type: DataType.UUIDV4,
        allowNull: false,
    })
    userId!: string;

    @Column({
        type: DataType.UUIDV4,
        allowNull: false,
    })
    tableId!: string;

    @CreatedAt
    declare createdAt: Date;

    @UpdatedAt
    declare updatedAt: Date;

    @DeletedAt
    declare deletedAt: Date;

    //satu User bisa memiliki banyak Resevation
    @BelongsTo(() => Users, 'userId') //jadi diambil dari Users, kuncinya userId
    user!: Users;

    @BelongsTo(() => Table_Information, 'tableId') 
    table_information!: Table_Information;
}