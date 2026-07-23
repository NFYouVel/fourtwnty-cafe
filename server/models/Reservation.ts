import {
  Table, Column, Model, DataType, PrimaryKey,
  CreatedAt, UpdatedAt, DeletedAt
} from 'sequelize-typescript';
import type { Users } from './Users.js';
import type { TableInformation } from './TableInformation.js';

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
  declare tanggal_reservation: Date;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare jumlah_orang: number;

  @Column({
    type: DataType.ENUM('Pending', 'Approved', 'Reschedule', 'Rejected'),
    allowNull: false,
    defaultValue: 'Pending',
  })
  declare status_reservation: 'Pending' | 'Approved' | 'Reschedule' | 'Rejected';

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare tanggal_reschedule: Date;

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

  // Relasi
  declare user?: Users;
  declare tableInformation?: TableInformation;
}