// models/MenuIngredient.ts
import {
  Table, Column, Model, DataType, PrimaryKey,
  CreatedAt, UpdatedAt, DeletedAt
} from 'sequelize-typescript';
import type { Menu } from './Menu.js';   // hanya untuk type
import type { Stock } from './Stock.js';

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

  // Kolom foreign key (tanpa dekorator @ForeignKey)
  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  declare menuId: string;

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

  // Properti relasi (hanya untuk type checking)
  // declare menu?: Menu;
  // declare stock?: Stock;
}