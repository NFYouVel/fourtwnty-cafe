import { Table, Column, Model, DataType, PrimaryKey, BelongsTo, CreatedAt, UpdatedAt, DeletedAt, HasMany } from 'sequelize-typescript';
import { OrderMenu} from './OrderMenu.js';
import { MenuIngredient } from './MenuIngredient.js';

@Table({
    tableName: 'Menu',
    timestamps: true,
    paranoid: true,
})
export class Menu extends Model {
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
        type: DataType.INTEGER,
        allowNull: false,
    })
    price!: number;

    @Column({
        type: DataType.STRING,
        unique: true,
        allowNull: false,
    })
    description!: string;

    @CreatedAt
    declare createdAt: Date;

    @UpdatedAt
    declare updatedAt: Date;

    @DeletedAt
    declare deletedAt: Date;

    //di userId ini bakal cari data (bisa lebih dari 1) di table Order
    @HasMany(() => OrderMenu, 'menuId') //1 userid bisa punya banyak order[]
    orderMenu! : OrderMenu[];

    @HasMany(() => MenuIngredient, 'menuId')
    menuIngredient! : MenuIngredient[];
}