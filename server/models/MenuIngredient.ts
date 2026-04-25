import {Table, Column, Model, DataType, PrimaryKey, BelongsTo, CreatedAt, UpdatedAt, DeletedAt, ForeignKey} from "sequelize-typescript";

import { Menu } from "./Menu.js";
import { Stock } from "./Stock.js";

@Table({
  tableName: "Junction_MenuIngredient",
  timestamps: true,
  paranoid: true
})
export class MenuIngredient extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false
  })
  declare id: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  declare jumlah_pemakaian: number;

  @ForeignKey(() => Menu)
  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  declare menuId: string;

  @ForeignKey(() => Stock)
  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  declare stockId: string;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;

  @DeletedAt
  declare deletedAt: Date;

  @BelongsTo(() => Menu, "menuId")
  declare menu: Menu;

  @BelongsTo(() => Stock, "stockId")
  declare stock: Stock;
}
