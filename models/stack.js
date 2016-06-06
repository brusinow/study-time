'use strict';
module.exports = function(sequelize, DataTypes) {
  var stack = sequelize.define('stack', {
    name: DataTypes.STRING,
    category: DataTypes.STRING,
    public: DataTypes.BOOLEAN,
    userId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        models.stack.hasMany(models.card);
      }
    }
  });
  return stack;
};