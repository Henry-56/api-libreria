const Sequelize = require('sequelize');
const sequelize = require('../db/config');
const { Pedido} = require('../models/pedidos');
const { Producto } = require('../models/productos');

const DetallePedido = sequelize.define("DetallePedidos", {
  id: { 
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  pedidos_id: { 
    type: Sequelize.INTEGER,
    allowNull: false
  },
  producto_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'productos', // Nombre de la tabla de referencia
      key: 'id' // Columna de referencia en la tabla de productos
    }
  },
  
  cantidad: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  precio: {
    type: Sequelize.FLOAT,
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

DetallePedido.belongsTo(Pedido, { foreignKey: 'pedidos_id' }); // Relación con Pedido
DetallePedido.belongsTo(Producto, { foreignKey: 'producto_id' }); // Relación con Producto

DetallePedido.sync()
  .then(() => console.log("Sequelize models initialized"))
  .catch(err => console.error("Error while initializing models: ", err));

module.exports = {
  DetallePedido
};
