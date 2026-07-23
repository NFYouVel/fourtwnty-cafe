import {
  Table, Column, Model, DataType, PrimaryKey,
  CreatedAt, UpdatedAt, DeletedAt
} from 'sequelize-typescript';
import type { Order } from './Order.js';

@Table({
  tableName: 'Payment',
  timestamps: true,
  paranoid: true,
})
export class Payment extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
  })
  declare id: string;

  @Column({
    type: DataType.ENUM('Unpaid', 'Paid', 'Cancelled'),
    allowNull: false,
    defaultValue: 'Unpaid',
  })
  declare status: 'Unpaid' | 'Paid' | 'Cancelled';

  @Column({
    type: DataType.ENUM('Cash', 'QRIS', 'Card'),
    allowNull: true,
  })
  declare method: 'Cash' | 'QRIS' | 'Card' | null;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare orderId: string;

  @CreatedAt
  declare createdAt: Date;
  @UpdatedAt
  declare updatedAt: Date;
  @DeletedAt
  declare deletedAt: Date;

  // Relasi
  declare order?: Order;
}