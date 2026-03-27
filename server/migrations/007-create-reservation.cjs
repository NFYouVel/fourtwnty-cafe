module.exports = {
    up: async (queryInterface, Sequelize) => {
        
        await queryInterface.createTable('Reservation', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                allowNull: false,
                primaryKey: true,
            },

            tanggal_reservation: {
                type: Sequelize.DATE,
                allowNull: false,
            },

            jumlah_orang: {
                type:Sequelize.INTEGER,
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

        await queryInterface.addColumn('Reservation', 'userId', {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
            references: { 
                model: 'Users',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
        })

        await queryInterface.addColumn('Reservation', 'tableId', {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
            references: { 
                model: 'TableInformation',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
        })

    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('Reservation', 'userId')
        await queryInterface.removeColumn('Reservation', 'tableId')
        await queryInterface.dropTable('Reservation');
    }
}