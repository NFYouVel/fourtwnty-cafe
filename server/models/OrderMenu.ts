import {
  Table, Column, Model, DataType, PrimaryKey,
  CreatedAt, UpdatedAt, DeletedAt
} from 'sequelize-typescript';
import type { Order } from './Order.js';
import type { Menu } from './Menu.js';

@Table({
  tableName: 'Junction_orderMenu',
  timestamps: true,
  paranoid: true,
})
export class OrderMenu extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare customization: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 1,
  })
  declare quantity: number;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare orderId: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare menuId: string;

  @CreatedAt
  declare createdAt: Date;
  @UpdatedAt
  declare updatedAt: Date;
  @DeletedAt
  declare deletedAt: Date;

  // Relasi
  declare order?: Order;
  declare menu?: Menu;
}