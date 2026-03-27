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
                type: Sequelize.ENUM('Paid', 'Cancelled'),
                allowNull: false,
            },

            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
            },

            deletedAt: {
                type: Sequelize.DATE,
                allowNull: true,
            },

            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
            }
        })

        await queryInterface.addColumn('Payment', 'orderId', {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
            references: {
                model: 'Order',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        })

    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('Payment', 'orderId');
        await queryInterface.dropTable('Payment');
    }
}