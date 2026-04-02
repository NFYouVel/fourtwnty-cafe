'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('TableInformation', [
      // --- INDOOR (10 Meja) ---
      { id: uuidv4(), table_number: 1, seat_count: 2, area: 'Indoor', status: 'Available', createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), table_number: 2, seat_count: 2, area: 'Indoor', status: 'Unavailable', createdAt: new Date(), updatedAt: new Date() }, // 1st Unavail
      { id: uuidv4(), table_number: 3, seat_count: 4, area: 'Indoor', status: 'Available', createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), table_number: 4, seat_count: 4, area: 'Indoor', status: 'Available', createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), table_number: 5, seat_count: 4, area: 'Indoor', status: 'Unavailable', createdAt: new Date(), updatedAt: new Date() }, // 2nd Unavail
      { id: uuidv4(), table_number: 6, seat_count: 6, area: 'Indoor', status: 'Available', createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), table_number: 7, seat_count: 6, area: 'Indoor', status: 'Available', createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), table_number: 8, seat_count: 8, area: 'Indoor', status: 'Available', createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), table_number: 9, seat_count: 2, area: 'Indoor', status: 'Available', createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), table_number: 10, seat_count: 4, area: 'Indoor', status: 'Available', createdAt: new Date(), updatedAt: new Date() },

      // --- OUTDOOR (7 Meja) ---
      { id: uuidv4(), table_number: 11, seat_count: 2, area: 'Outdoor', status: 'Available', createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), table_number: 12, seat_count: 2, area: 'Outdoor', status: 'Unavailable', createdAt: new Date(), updatedAt: new Date() }, // 1st Unavail
      { id: uuidv4(), table_number: 13, seat_count: 4, area: 'Outdoor', status: 'Available', createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), table_number: 14, seat_count: 4, area: 'Outdoor', status: 'Available', createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), table_number: 15, seat_count: 4, area: 'Outdoor', status: 'Available', createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), table_number: 16, seat_count: 2, area: 'Outdoor', status: 'Available', createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), table_number: 17, seat_count: 6, area: 'Outdoor', status: 'Available', createdAt: new Date(), updatedAt: new Date() }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('TableInformation', null, {});
  }
};