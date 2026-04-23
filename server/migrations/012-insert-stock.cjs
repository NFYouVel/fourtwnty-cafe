'use strict';
const { v4: uuidv4 } = require('uuid');
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert("Stock", [
            {
                id: uuidv4(),
                ingredient_name: "Kentang",
                amount: 10000,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: uuidv4(),
                ingredient_name: "Tahu",
                amount: 5000,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: uuidv4(),
                ingredient_name: "Indomie",
                amount: 200,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: uuidv4(),
                ingredient_name: "Telor",
                amount: 300,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: uuidv4(),
                ingredient_name: "Roti Burger",
                amount: 500,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: uuidv4(),
                ingredient_name: "Daging",
                amount: 5000,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: uuidv4(),
                ingredient_name: "Selada",
                amount: 300,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: uuidv4(),
                ingredient_name: "Saos Tomat",
                amount: 3000,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: uuidv4(),
                ingredient_name: "Sosis",
                amount: 3000,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: uuidv4(),
                ingredient_name: "Nugget",
                amount: 3000,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: uuidv4(),
                ingredient_name: "Kopi",
                amount: 2000,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: uuidv4(),
                ingredient_name: "Teh",
                amount: 500,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: uuidv4(),
                ingredient_name: "Gula",
                amount: 5000,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: uuidv4(),
                ingredient_name: "Chocolate Powder",
                amount: 3000,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: uuidv4(),
                ingredient_name: "Air",
                amount: 50000,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete("Stock", null, {});
    }
};
