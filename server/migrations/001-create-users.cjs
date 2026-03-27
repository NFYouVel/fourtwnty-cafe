module.exports = {
    up: async (queryInterface, Sequelize) => {
        
        await queryInterface.createTable('Users', {
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

            email: {
                type: Sequelize.STRING,
                unique: true,
                allowNull: false,
            },

            password: {
                type: Sequelize.STRING,
                allowNull: false,
            },

            phone: {
                type:Sequelize.STRING,
                allowNull: false
            },

            user_role: {
                type:Sequelize.ENUM('Customer', 'Staff', 'Manager'),
                defaultValue: 'Customer',
                allowNull: false
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
        await queryInterface.dropTable('Users');
    }
}