const Sequelize = require('sequelize');
const sequelize = require('../db/config');


const DireccionEnvio = sequelize.define("direccion_envios", {
  id: { 
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  direccion: {
    type: Sequelize.STRING,
    allowNull: false
  },
  telefono: {
    type: Sequelize.INTEGER,
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


DireccionEnvio.sync()
  .then(() => {
    console.log("Sequelize models synchronized successfully");
    // Realiza acciones adicionales después de la sincronización
  })
  .catch(err => {
    console.error("Error while synchronizing Sequelize models: ", err);
    // Maneja el error de sincronización
  });

module.exports = {
  DireccionEnvio
};
