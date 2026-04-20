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

            category: {
                type: Sequelize.ENUM("Main","Appetizer", "Side", "Dessert", "Drink"),
                allowNull: false,
            },

            drink_category: {
                type: Sequelize.ENUM("Coffee", "Non-Coffee", "Tea", "Frappe", "Juice", "Other"),
                allowNull: true,
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