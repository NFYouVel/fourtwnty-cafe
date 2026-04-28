'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        const { v4: uuidv4 } = await import('uuid');
        await queryInterface.bulkInsert("Stock", [
            {
                id: uuidv4(),
                ingredient_name: "Kentang",
                amount: 10000,
                unit: 'Bungkus',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: uuidv4(),
                ingredient_name: "Tahu",
                amount: 5000,
                unit: 'Bungkus',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: uuidv4(),
                ingredient_name: "Indomie",
                amount: 200,
                unit: 'Bungkus',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: uuidv4(),
                ingredient_name: "Telor",
                amount: 300,
                unit: 'Bungkus',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: uuidv4(),
                ingredient_name: "Roti Burger",
                amount: 500,
                unit: 'Bungkus',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: uuidv4(),
                ingredient_name: "Daging",
                amount: 5000,
                unit: 'Bungkus',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: uuidv4(),
                ingredient_name: "Selada",
                amount: 300,
                unit: 'Bungkus',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: uuidv4(),
                ingredient_name: "Saos Tomat",
                amount: 3000,
                unit: 'Bungkus',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: uuidv4(),
                ingredient_name: "Sosis",
                amount: 3000,
                unit: 'Bungkus',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: uuidv4(),
                ingredient_name: "Nugget",
                amount: 3000,
                unit: 'Bungkus',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: uuidv4(),
                ingredient_name: "Kopi",
                amount: 2000,
                unit: 'Bungkus',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: uuidv4(),
                ingredient_name: "Teh",
                amount: 500,
                unit: 'Bungkus',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: uuidv4(),
                ingredient_name: "Gula",
                amount: 5000,
                unit: 'Bungkus',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: uuidv4(),
                ingredient_name: "Chocolate Powder",
                amount: 3000,
                unit: 'Bungkus',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: uuidv4(),
                ingredient_name: "Air",
                amount: 50000,
                unit: 'Bungkus',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete("Stock", null, {});
    }
};
