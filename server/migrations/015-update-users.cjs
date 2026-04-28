module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Users", "reset_code", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("Users", "reset_code_expired", {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Users", "reset_code");
    await queryInterface.removeColumn("Users", "reset_code_expired");
  }
};
