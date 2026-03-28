import { Table, Column, Model, DataType, PrimaryKey, BelongsTo, CreatedAt, UpdatedAt, DeletedAt, HasMany } from 'sequelize-typescript';
import { Menu } from './Menu.js';
import { Stock } from './Stock.js'

@Table({
    tableName: 'Junction_MenuIngredient',
    timestamps: true,
    paranoid: true,
})
export class MenuIngredient extends Model {
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
    jumlah_pemakaian!: number;

    @Column({
        type: DataType.UUIDV4,
        allowNull: false,
    })
    menuId!: string;

    @Column({
        type: DataType.UUIDV4,
        allowNull: false,
    })
    stockId!: string;

    @CreatedAt
    declare createdAt: Date;

    @UpdatedAt
    declare updatedAt: Date;

    @DeletedAt
    declare deletedAt: Date;

    @BelongsTo(() => Menu, 'menuId')
    menu!: Menu;

    @BelongsTo(() => Stock, 'stockId')
    stock!: Stock;
}