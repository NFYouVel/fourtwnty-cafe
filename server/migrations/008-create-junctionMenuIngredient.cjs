module.exports = {
    up: async (queryInterface, Sequelize) => {
        
        await queryInterface.createTable('Junction_MenuIngredient', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                allowNull: false,
                primaryKey: true,
            },

            jumlah_pemakaian: {
                type: Sequelize.INTEGER,
                allowNull: true,
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

        await queryInterface.addColumn('Junction_MenuIngredient', 'menuId', {
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

        await queryInterface.addColumn('Junction_MenuIngredient', 'stockId', {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
            references: {
                model: 'Stock',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
        })
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('Junction_MenuIngredient', 'menuId');
        await queryInterface.removeColumn('Junction_MenuIngredient', 'stockId');
        await queryInterface.dropTable('Junction_MenuIngredient');
    }
}