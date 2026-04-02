const { v4: uuidv4 } = require('uuid');

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('Stock', [
            {
                id: uuidv4(),
                ingredient_name: 'Coffee Beans',
                amount: 5,
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        ]);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Stock', null, {});
    }
};