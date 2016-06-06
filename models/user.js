'use strict';
module.exports = function(sequelize, DataTypes) {
  var user = sequelize.define('user', {
    email: DataTypes.STRING,
    name: DataTypes.STRING,
    password: {
      type: DataTypes.STRING,
      validate: {
        len: [8, 99]
      }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return user;
};