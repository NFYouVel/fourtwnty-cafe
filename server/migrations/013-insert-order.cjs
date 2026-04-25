'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
    async up(queryInterface, Sequelize) {
        const users = await queryInterface.sequelize.query(
            `SELECT id FROM "Users";`
        );

        const userId = users[0].map(u => u.id);
        const now = new Date();

        await queryInterface.bulkInsert('Order', [
            {
                id: uuidv4(),
                order_type: 'Dine-in',
                status: 'Closed',
                total_price: 25000,
                userId: userId[0],
                createdAt: now,
                updatedAt: now,
            },
            {
                id: uuidv4(),
                order_type: 'Takeaway',
                status: 'Closed',
                total_price: 40000,
                userId: userId[1],
                createdAt: now,
                updatedAt: now,
            },
            {
                id: uuidv4(),
                order_type: 'Dine-in',
                status: 'Cancelled',
                total_price: 30000,
                userId: userId[2],
                createdAt: now,
                updatedAt: now,
            },
            {
                id: uuidv4(),
                order_type: 'Takeaway',
                status: 'Process',
                total_price: 15000,
                userId: userId[3],
                createdAt: now,
                updatedAt: now,
            },

            // 🔥 kemarin
            {
                id: uuidv4(),
                order_type: 'Dine-in',
                status: 'Closed',
                total_price: 50000,
                userId: userId[0],
                createdAt: new Date(now.getTime() - 86400000),
                updatedAt: now,
            },
            {
                id: uuidv4(),
                order_type: 'Takeaway',
                status: 'Cancelled',
                total_price: 20000,
                userId: userId[1],
                createdAt: new Date(now.getTime() - 86400000),
                updatedAt: now,
            },

            // 🔥 random tambahan
            {
                id: uuidv4(),
                order_type: 'Dine-in',
                status: 'Closed',
                total_price: 80000,
                userId: userId[4],
                createdAt: new Date(now.getTime() - 2 * 86400000),
                updatedAt: now,
            },
        ]);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Order', null, {});
    }
};
