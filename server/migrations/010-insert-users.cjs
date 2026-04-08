'use strict';

const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {

    const password = await bcrypt.hash('123456', 10);

    await queryInterface.bulkInsert('Users', [
      {
        id: uuidv4(),
        name: 'Marvel Nathanael Lie',
        email: 'marvel@gmail.com',
        password: password,
        phone: '081111111111',
        user_role: 'Customer',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'Alya Putri',
        email: 'alya@gmail.com',
        password: password,
        phone: '082222222222',
        user_role: 'Customer',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'Rizky Pratama',
        email: 'rizky@gmail.com',
        password: password,
        phone: '083333333333',
        user_role: 'Staff',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'Dewi Lestari',
        email: 'dewi@gmail.com',
        password: password,
        phone: '084444444444',
        user_role: 'Staff',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'Budi Santoso',
        email: 'budi@gmail.com',
        password: password,
        phone: '085555555555',
        user_role: 'Manager',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
