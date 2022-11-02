'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SocialMedia extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User);
    }
  }
  SocialMedia.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'name cannot be empty.'
        },
        notNull: {
          msg: 'name cannot be null.'
        }
      }
    },
    social_media_url: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'social_media_url cannot be empty.'
        },
        notNull: {
          msg: 'social_media_url cannot be null.'
        },
        isUrl: {
          msg: 'social_media_url url not valid.'
        }
      }
    },
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'SocialMedia',
  });
  // SocialMedia.User = SocialMedia.belongsTo(User);
  return SocialMedia;
};