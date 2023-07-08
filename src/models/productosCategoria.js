const Sequelize = require('sequelize');
const sequelize = require('../db/config');
const { Producto } = require('./productos');
const { Categoria } = require('../models/categorias');

const ProductoCategoria = sequelize.define("productos_categorias", {
  id: { 
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  producto_id: {
    type: Sequelize.INTEGER,
    allowNull: true
  },
  categoria_id: { 
    type: Sequelize.INTEGER,
    allowNull: true
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

ProductoCategoria.belongsTo(Producto, {
    foreignKey: 'producto_id',
    as: 'producto'
  });
  
  ProductoCategoria.belongsTo(Categoria, {
    foreignKey: 'categoria_id',
    as: 'categoria'
  });


ProductoCategoria.sync()
  .then(() => console.log("Sequelize models initialized"))
  .catch(err => console.error("Error while initializing models: ", err));

module.exports = {
  ProductoCategoria
};
