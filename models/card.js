'use strict';
module.exports = function(sequelize, DataTypes) {
  var card = sequelize.define('card', {
    question: DataTypes.TEXT,
    q_photo: DataTypes.STRING,
    answer: DataTypes.TEXT,
    a_photo: DataTypes.STRING,
    stackId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        models.card.belongsTo(models.stack);
      }
    }
  });
  return card;
};