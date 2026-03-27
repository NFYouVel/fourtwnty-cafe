module.exports = {
    up: async (queryInterface, Sequelize) => {
        
        await queryInterface.createTable('Order', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                allowNull: false,
                primaryKey: true,
            },

            order_type: {
                type: Sequelize.ENUM('Dine-in', 'Takeaway'),
                allowNull: false,
            },

            status: {
                type: Sequelize.ENUM('Process', 'Cancelled', 'Closed'),
                defaultValue: 'Process',
                allowNull: false,
            },

            total_price: {
                type: Sequelize.DECIMAL(10,2),
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

        await queryInterface.addColumn('Order', 'userId', {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
            references: { 
                model: 'Users',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        })

    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('Order', 'userId')
        await queryInterface.dropTable('Order');
    }
}