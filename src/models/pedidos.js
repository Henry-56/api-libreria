const Sequelize = require('sequelize');
const sequelize = require('../db/config');
const { Cliente } = require('../models/clientes');
const { DireccionEnvio } = require('../models/direccionEnvio');

const Pedido = sequelize.define("pedidos", {
  id: { 
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  cliente_id: { 
    type: Sequelize.INTEGER,
    allowNull: true
  },
  fecha_pedido: {
    type: Sequelize.DATE,
    allowNull: false
  },
  costo: {
    type: Sequelize.FLOAT,
    allowNull: false
  },
  estado: {
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

Pedido.belongsTo(Cliente, { foreignKey: 'cliente_id' }); // Relación con Cliente

Pedido.sync()
  .then(() => console.log("Sequelize models initialized"))
  .catch(err => console.error("Error while initializing models: ", err));

module.exports = {
  Pedido
};
