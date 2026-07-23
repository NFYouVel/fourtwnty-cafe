import {
  Table, Column, Model, DataType, PrimaryKey,
  CreatedAt, UpdatedAt, DeletedAt
} from 'sequelize-typescript';
import type { MenuIngredient } from './MenuIngredient.js';

@Table({
  tableName: 'Stock',
  timestamps: true,
  paranoid: true,
})
export class Stock extends Model {
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
  declare ingredient_name: string;

  @Column({
    type: DataType.ENUM('Gram', 'Buah', 'Bungkus', 'Lembar', 'Mililiter'),
    allowNull: false,
  })
  declare unit: 'Gram' | 'Buah' | 'Bungkus' | 'Lembar' | 'Mililiter';

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare amount: number;

  @CreatedAt
  declare createdAt: Date;
  @UpdatedAt
  declare updatedAt: Date;
  @DeletedAt
  declare deletedAt: Date;

  // Relasi
  // declare menuIngredient?: MenuIngredient[];
}