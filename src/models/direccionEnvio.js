const Sequelize = require('sequelize');
const sequelize = require('../db/config');
const { Cliente } = require('../models/clientes');

const DireccionEnvio = sequelize.define("direccion_envio", {
  id: { 
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  cliente_id: { 
    type: Sequelize.INTEGER,
    allowNull: true
  },
  nombre: {
    type: Sequelize.STRING,
    allowNull: false
  },
  apellido: {
    type: Sequelize.STRING,
    allowNull: false
  },

  compania: {
    type: Sequelize.STRING,
    allowNull: false
  },
  correo: {
    type: Sequelize.STRING,
    allowNull: false
  },
  telefono: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  pais: {
    type: Sequelize.STRING,
    allowNull: false
  },
  ciudad: {
    type: Sequelize.STRING,
    allowNull: false
  },
  provincia: {
    type: Sequelize.STRING,
    allowNull: false
  },
  codigo_postal: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  direccion: {
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

DireccionEnvio.belongsTo(Cliente, { foreignKey: 'cliente_id' });
// Se establece la relación con la tabla Cliente utilizando la clave externa 'cliente_id'

DireccionEnvio.sync({ force: true })
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
