'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        const { v4: uuidv4 } = await import('uuid');
        const menus = await queryInterface.sequelize.query(
            `SELECT id, name FROM "Menu";`,
            { type: Sequelize.QueryTypes.SELECT }
        );

        const stocks = await queryInterface.sequelize.query(
            `SELECT id, ingredient_name FROM "Stock";`,
            { type: Sequelize.QueryTypes.SELECT }
        );

        const menuMap = {};
        const stockMap = {};

        menus.forEach(menu => {
            menuMap[menu.name] = menu.id;
        });

        stocks.forEach(stock => {
            stockMap[stock.ingredient_name] = stock.id;
        });

        await queryInterface.bulkInsert(
            "Junction_MenuIngredient",
            [
                // French Fries
                {
                    id: uuidv4(),
                    menuId: menuMap["French Fries"],
                    stockId: stockMap["Kentang"],
                    jumlah_pemakaian: 200,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },

                // Tahu Cabe Garam
                {
                    id: uuidv4(),
                    menuId: menuMap["Tahu Cabe Garam"],
                    stockId: stockMap["Tahu"],
                    jumlah_pemakaian: 150,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },

                // Indomie Telor
                {
                    id: uuidv4(),
                    menuId: menuMap["Indomie Telor"],
                    stockId: stockMap["Indomie"],
                    jumlah_pemakaian: 1,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    id: uuidv4(),
                    menuId: menuMap["Indomie Telor"],
                    stockId: stockMap["Telor"],
                    jumlah_pemakaian: 1,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },

                // Burger
                {
                    id: uuidv4(),
                    menuId: menuMap["Burger"],
                    stockId: stockMap["Roti Burger"],
                    jumlah_pemakaian: 2,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    id: uuidv4(),
                    menuId: menuMap["Burger"],
                    stockId: stockMap["Daging"],
                    jumlah_pemakaian: 100,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    id: uuidv4(),
                    menuId: menuMap["Burger"],
                    stockId: stockMap["Selada"],
                    jumlah_pemakaian: 1,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    id: uuidv4(),
                    menuId: menuMap["Burger"],
                    stockId: stockMap["Saos Tomat"],
                    jumlah_pemakaian: 15,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },

                // Mix Platter
                {
                    id: uuidv4(),
                    menuId: menuMap["Mix Platter"],
                    stockId: stockMap["Kentang"],
                    jumlah_pemakaian: 100,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    id: uuidv4(),
                    menuId: menuMap["Mix Platter"],
                    stockId: stockMap["Sosis"],
                    jumlah_pemakaian: 100,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    id: uuidv4(),
                    menuId: menuMap["Mix Platter"],
                    stockId: stockMap["Nugget"],
                    jumlah_pemakaian: 100,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },

                // Americano
                {
                    id: uuidv4(),
                    menuId: menuMap["Americano"],
                    stockId: stockMap["Kopi"],
                    jumlah_pemakaian: 15,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    id: uuidv4(),
                    menuId: menuMap["Americano"],
                    stockId: stockMap["Air"],
                    jumlah_pemakaian: 100,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },

                // Ice Tea
                {
                    id: uuidv4(),
                    menuId: menuMap["Ice Tea"],
                    stockId: stockMap["Teh"],
                    jumlah_pemakaian: 1,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    id: uuidv4(),
                    menuId: menuMap["Ice Tea"],
                    stockId: stockMap["Air"],
                    jumlah_pemakaian: 100,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    id: uuidv4(),
                    menuId: menuMap["Ice Tea"],
                    stockId: stockMap["Gula"],
                    jumlah_pemakaian: 5,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },

                // Ice Chocolate
                {
                    id: uuidv4(),
                    menuId: menuMap["Ice Chocolate"],
                    stockId: stockMap["Chocolate Powder"],
                    jumlah_pemakaian: 50,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    id: uuidv4(),
                    menuId: menuMap["Ice Chocolate"],
                    stockId: stockMap["Gula"],
                    jumlah_pemakaian: 10,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    id: uuidv4(),
                    menuId: menuMap["Ice Chocolate"],
                    stockId: stockMap["Air"],
                    jumlah_pemakaian: 200,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            ]
        );
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete("Junction_MenuIngredient", null, {});
    }
};
