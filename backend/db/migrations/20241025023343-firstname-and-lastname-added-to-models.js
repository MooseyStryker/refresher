'use strict';

let options = {};
if (process.env.NODE_ENV === 'production'){
  options.schema = prcess.env.SCHEMA // Defines the schema in the option object for render
}
options.tableName = "Users"

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn(options, 'firstName', {
      type: Sequelize.STRING
    });

    await queryInterface.addColumn(options, 'lastName', {
      type: Sequelize.STRING
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn(options, 'firstName')
    await queryInterface.removeColumn(options, 'lastName')
  }
};
