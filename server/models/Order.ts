import {
  Table, Column, Model, DataType, PrimaryKey,
  CreatedAt, UpdatedAt, DeletedAt
} from 'sequelize-typescript';
import type { Users } from './Users.js';
import type { OrderMenu } from './OrderMenu.js';
import type { Payment } from './Payment.js';
import type { TableInformation } from './TableInformation.js';

@Table({
  tableName: 'Order',
  timestamps: true,
  paranoid: true,
})
export class Order extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
  })
  declare id: string;

  @Column({
    type: DataType.ENUM('Dine-in', 'Takeaway'),
    allowNull: false,
  })
  declare order_type: 'Dine-in' | 'Takeaway';

  @Column({
    type: DataType.ENUM('Process', 'Cancelled', 'Closed'),
    allowNull: false,
    defaultValue: 'Process',
  })
  declare status: 'Process' | 'Cancelled' | 'Closed';

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  declare total_price: number;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare userId: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare tableId: string;

  @CreatedAt
  declare createdAt: Date;
  @UpdatedAt
  declare updatedAt: Date;
  @DeletedAt
  declare deletedAt: Date;

  // Relasi (tipe)
  declare user?: Users;
  declare table?: TableInformation;
  declare orderMenus?: OrderMenu[];
  declare payment?: Payment;
}