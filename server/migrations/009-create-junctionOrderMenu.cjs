module.exports = {
    up: async (queryInterface, Sequelize) => {
        
        await queryInterface.createTable('Junction_orderMenu', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                allowNull: false,
                primaryKey: true,
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

        await queryInterface.addColumn('Junction_orderMenu', 'orderId', {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
            references: {
                model: 'Order',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
        })

        await queryInterface.addColumn('Junction_orderMenu', 'menuId', {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
            references: {
                model: 'Menu',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
        })

    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('Junction_orderMenu', 'orderId');
        await queryInterface.removeColumn('Junction_orderMenu', 'menuId');
        await queryInterface.dropTable('Junction_orderMenu');
    }
}