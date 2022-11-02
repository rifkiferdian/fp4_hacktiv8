'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Photos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING
      },
      caption: {
        allowNull: false,
        type: Sequelize.STRING
      },
      poster_image_url: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      UserId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    await queryInterface.addConstraint('Photos', {
      fields: ['UserId'],
      type: "FOREIGN KEY",
      name: 'user_fk',
      references: { 
        table: 'Users',
        field: 'id'
      },
      onDelete: "cascade",
      onUpdate: "cascade"
    });

  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Photos');
  }
};