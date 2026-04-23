import { Table, Column, Model, DataType, PrimaryKey, BelongsTo, CreatedAt, UpdatedAt, DeletedAt, ForeignKey } from 'sequelize-typescript'; // Tambahkan ForeignKey di import
import { Menu } from './Menu.js';
import { Order } from './Order.js';

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
        allowNull: true, // Sebaiknya true jika user tidak memberikan catatan
    })
    declare customization: string;
    
    @CreatedAt
    declare createdAt: Date;
    
    @UpdatedAt
    declare updatedAt: Date;
    
    @DeletedAt
    declare deletedAt: Date;
    
    @BelongsTo(() => Order, 'orderId')
    order!: Order;
    
    @BelongsTo(() => Menu, 'menuId')
    menu!: Menu;
    // --- PERBAIKAN ---
    @ForeignKey(() => Order)
    @Column({
        type: DataType.UUID, 
        allowNull: false,
    })
    orderId!: string;

    @ForeignKey(() => Menu)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    menuId!: string;
    // -------------------------
}