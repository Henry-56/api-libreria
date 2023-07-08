const Sequelize = require('sequelize');
const sequelize = require('../db/config');
const { Producto } = require('../models/productos');

const ProductoPicture = sequelize.define('productos_pictures', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  producto_id: {
    type: Sequelize.INTEGER,
    allowNull: true
  },
  img_url: {
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

Producto.sync().then(() => {
  Producto.hasMany(ProductoPicture, {
    foreignKey: 'producto_id',
    as: 'producto_pictures',
  });
});

ProductoPicture.sync()
  .then(() => console.log('Sequelize models initialized'))
  .catch(err => console.error('Error while initializing models:', err));

module.exports = {
  ProductoPicture
};
