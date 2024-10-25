'use strict';

// const { decrypt } = require('dotenv');
const { User } = require('../models');
const bcrypt = require("bcryptjs")

let options = {}
if (process.env.NODE_ENV === 'production'){
  options.schema = process.env.SCHEMA; // This defines the schema in options object in Render
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await User.bulkCreate([
      {
        email: 'demo@user.io',
        firstName: 'Fake1',
        lastName: 'FakeLast1',
        username: 'Demo-lition',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        email: 'user1@user.io',
        firstName: 'Fakefirstname2',
        lastName: 'Fakelastname2',
        username: 'FakeUser2',
        hashedPassword: bcrypt.hashSync('password2')
      },
      {
        email: 'user2@user.io',
        firstName: 'Fakefirstname3',
        lastName: 'Fakelastname3',
        username: 'FakeUser3',
        hashedPassword: bcrypt.hashSync('password3')
      }
    ], { validate: true })
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Users';
    const Op = Sequelize.Op
    return queryInterface.bulkDelete(options, {
      username: {
        [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2']
      }
    }, {})
  }
};
