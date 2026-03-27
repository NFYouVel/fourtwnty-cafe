module.exports = {
    up: async (queryInterface, Sequelize) => {
        
        await queryInterface.createTable('TableInformation', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                allowNull: false,
                primaryKey: true,
            },

            table_number: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },

            seat_count: {
                type:Sequelize.INTEGER,
                allowNull: false
            },

            area: {
                type: Sequelize.ENUM('Indoor', 'Outdoor'),
                allowNull: false,
            },

            status: {
                type: Sequelize.ENUM('Unavailable', 'Available'),
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
        await queryInterface.dropTable('TableInformation');
    }
}