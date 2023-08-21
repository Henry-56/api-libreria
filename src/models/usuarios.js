const Sequelize = require('sequelize');
const sequelize = require('../db/config');
const { Persona } = require('../models/personas');

const Usuario = sequelize.define("usuarios", {
  id: { 
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  persona_id: {
    type: Sequelize.INTEGER,
    allowNull: true
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  // rol: {
  //   type: Sequelize.STRING,
  //   allowNull: false
  // },
  createdAt: {
    type: Sequelize.DATE,
    allowNull: true
  },
  updatedAt: {
    type: Sequelize.DATE,
    allowNull: true
  }
});

Usuario.belongsTo(Persona, { foreignKey: 'persona_id' });

Usuario.sync()
  .then(() => console.log("Sequelize models initialized"))
  .catch(err => console.error("Error while initializing models: ", err));

module.exports = {
  Usuario
};
