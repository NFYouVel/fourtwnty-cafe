'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Menu', [

      // ===== FOOD =====
      {
        id: uuidv4(),
        name: 'French Fries',
        price: 30000,
        category: 'Side',
        drink_category: null,
        description: 'Crispy golden potato fries served hot and fresh.',
        createdAt: new Date(),
        updatedAt: new Date()
      },

      {
        id: uuidv4(),
        name: 'Tahu Cabe Garam',
        price: 30000,
        category: 'Side',
        drink_category: null,
        description: 'Fried tofu tossed with chili and savory garlic seasoning.',
        createdAt: new Date(),
        updatedAt: new Date()
      },

      {
        id: uuidv4(),
        name: 'Indomie Telor',
        price: 15000,
        category: 'Main',
        drink_category: null,
        description: 'Classic instant noodles served with a fried egg.',
        createdAt: new Date(),
        updatedAt: new Date()
      },

      {
        id: uuidv4(),
        name: 'Burger',
        price: 40000,
        category: 'Main',
        drink_category: null,
        description: 'Juicy beef burger with fresh lettuce and tomato sauce.',
        createdAt: new Date(),
        updatedAt: new Date()
      },

      {
        id: uuidv4(),
        name: 'Mix Platter',
        price: 40000,
        category: 'Appetizer',
        drink_category: null,
        description: 'A delicious combo of fries, sausages, and nuggets.',
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // ===== DRINK =====
      {
        id: uuidv4(),
        name: 'Americano',
        price: 25000,
        category: 'Drink',
        drink_category: 'Coffee',
        description: 'Bold espresso blended with hot water for a smooth taste.',
        createdAt: new Date(),
        updatedAt: new Date()
      },

      {
        id: uuidv4(),
        name: 'Ice Tea',
        price: 15000,
        category: 'Drink',
        drink_category: 'Other',
        description: 'Refreshing iced tea served chilled and sweetened.',
        createdAt: new Date(),
        updatedAt: new Date()
      },

      {
        id: uuidv4(),
        name: 'Ice Chocolate',
        price: 30000,
        category: 'Drink',
        drink_category: 'Non-Coffee',
        description: 'Rich chocolate drink served cold and creamy.',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Menu', null, {});
  }
};
