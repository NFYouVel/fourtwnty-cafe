import {
  Table, Column, Model, DataType, PrimaryKey,
  CreatedAt, UpdatedAt, DeletedAt
} from 'sequelize-typescript';
import type { Order } from './Order.js';
import type { Reservation } from './Reservation.js';

@Table({
  tableName: 'TableInformation',
  timestamps: true,
  paranoid: true,
})
export class TableInformation extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
  })
  declare id: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare table_number: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare seat_count: number;

  @Column({
    type: DataType.ENUM('Indoor', 'Outdoor'),
    allowNull: false,
  })
  declare area: 'Indoor' | 'Outdoor';

  @Column({
    type: DataType.ENUM('Unavailable', 'Available'),
    allowNull: false,
  })
  declare status: 'Unavailable' | 'Available';

  @CreatedAt
  declare createdAt: Date;
  @UpdatedAt
  declare updatedAt: Date;
  @DeletedAt
  declare deletedAt: Date;

  // Relasi
  declare order?: Order[];
  declare reservation?: Reservation[];
}