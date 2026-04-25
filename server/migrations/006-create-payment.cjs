module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Payment', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                allowNull: false,
                primaryKey: true,
            },
            table_number: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            status: {
                // Sequelize otomatis membuat type "enum_Payment_status"
                type: Sequelize.ENUM('Unpaid', 'Paid', 'Cancelled'),
                allowNull: false,
            },
            method: {
                // Sequelize otomatis membuat type "enum_Payment_method"
                type: Sequelize.ENUM('Cash', 'QRIS', 'Card'),
                allowNull: true,
            },
            // ... kolom lainnya sama ...
            createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
            updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
            deletedAt: { type: Sequelize.DATE, allowNull: true },
        });

        await queryInterface.addColumn('Payment', 'orderId', {
            type: Sequelize.UUID,
            allowNull: false,
            references: { model: 'Order', key: 'id' },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        });
    },

    async down(queryInterface, Sequelize) {
        // 1. Hapus kolom FK dulu
        await queryInterface.removeColumn('Payment', 'orderId');

        // 2. Hapus Tabel
        await queryInterface.dropTable('Payment');

        // 3. WAJIB: Hapus tipe ENUM secara manual di PostgreSQL
        // Ini untuk mencegah error "does not exist" atau "already exists" di kemudian hari
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Payment_status";');
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Payment_method";');
    }
}