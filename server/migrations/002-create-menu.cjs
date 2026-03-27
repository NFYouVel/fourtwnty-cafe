module.exports = {
    up: async (queryInterface, Sequelize) => {
        
        await queryInterface.createTable('Menu', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                allowNull: false,
                primaryKey: true,
            },

            name: {
                type: Sequelize.STRING,
                allowNull: false,
            },

            price: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },

            description: {
                type: Sequelize.STRING,
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

    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Menu');
    }
}