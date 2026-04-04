'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [
      {
        id: uuidv4(),
        name: 'User One',
        email: 'user1@gmail.com',
        password: '123456',
        phone: '081111111111',
        user_role: 'Customer',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'Marvel',
        email: 'staff1@gmail.com',
        password: '123456',
        phone: '082222222222',
        user_role: 'Staff',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'David',
        email: 'staff2@gmail.com',
        password: '123456',
        phone: '083333333333',
        user_role: 'Staff',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'Thasya',
        email: 'staff3@gmail.com',
        password: '123456',
        phone: '084444444444',
        user_role: 'Staff',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
