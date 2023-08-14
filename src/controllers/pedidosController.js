const Sequelize = require('sequelize'); // Add this line to import Sequelize
const { Producto } = require('../models/productos');
const { Pedido } = require('../models/pedidos');
const { DetallePedido } = require('../models/detallePedido');
const { DireccionEnvio } = require('../models/direccionEnvio');
const { Cliente } = require('../models/clientes');
    
async function list() {
  try {
    const detallePedidos = await DetallePedido.findAll({
      include: [
        {
          model: Pedido,
          as: 'pedido',
          include: [
            {
              model: Cliente,
              as: 'cliente',
              include: [
                {
                  model: DireccionEnvio,
                  as: 'direccion_envio',
                }, 
              ]
            }, 
          ]
        },
        {
          model: Producto,
          as: 'producto',
        }
      ]
    });

    return detallePedidos;
  } catch (error) {
    console.error('Error al obtener los datos:', error);
    throw error;
  }
}




function listt() {
  return DetallePedido.findAll(
    {
      include:[
        {
          model: Pedido,
          as: 'pedidos',
        }
      ]
    }
  );
}

async function save(data, productos, clienteId) {
  try {
    // Guardar el pedido
    const nuevoPedido = await Pedido.create({ 
      cliente_id: clienteId,
      fecha_pedido: data.fecha_pedido,
      costo: data.costo,
      estado: data.estado,
    });

    // Agregar detalles de pedido para cada producto
    for (const producto of productos) {
      const productoExistente = await Producto.findByPk(producto.id); // Verificar si el producto existe

      if (!productoExistente) {
        throw new Error(`El producto con ID ${producto.id} no existe.`);
      }

      await DetallePedido.create({
        pedidos_id: nuevoPedido.id,
        producto_id: producto.id,
        cantidad: producto.cantidad,
        precio: producto.precio,
        // ... otros campos ...
      });
    }

    return nuevoPedido;
  } catch (error) {
    console.error('Error al guardar el pedido:', error);
    throw error;
  }
}


 function eliminar(id) {
  return Pedidos.destroy({
    where: {
      id: id
    },
  })
};

function edit(id) {
  return Pedidos.findAll({
    where: {
      id: id
    },
  })
};







module.exports={
    list,
    save,
    eliminar,
    edit,
    
}