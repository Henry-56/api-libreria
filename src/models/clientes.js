const Sequelize = require('sequelize');
const sequelize = require('../db/config');
const { Persona } = require('../models/personas');

const Cliente = sequelize.define("clientes", {
  id: { 
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  persona_id: { 
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  direccion: {
    type: Sequelize.STRING,
    allowNull: true
  },
  codigo_postal: {
    type: Sequelize.STRING,
    allowNull: false
  },
  createdAt: {
    type: Sequelize.DATE,
    allowNull: true
  },
  updatedAt: {
    type: Sequelize.DATE,
    allowNull: true
  }
});

Cliente.belongsTo(Persona, { foreignKey: 'persona_id' });

Cliente.sync()
  .then(() => console.log("Sequelize models initialized"))
  .catch(err => console.error("Error while initializing models: ", err));

module.exports = {
  Cliente
};
