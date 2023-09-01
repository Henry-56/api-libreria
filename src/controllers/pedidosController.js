const Sequelize = require('sequelize'); // Add this line to import Sequelize
const nodemailer = require('nodemailer');
const { Producto } = require('../models/productos');
const { Persona } = require('../models/personas');
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
                  {
                    model: Persona,
                    as: 'persona',
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


async function eliminar(id) {
  try {
    // Buscar el pedido por su ID
    const pedido = await Pedido.findByPk(id);

    if (!pedido) {
      throw new Error(`No se encontró el pedido con ID ${id}.`);
    }

    // Eliminar los DetallePedido asociados al Pedido
    await DetallePedido.destroy({
      where: {
        pedidos_id: pedido.id,
      },
    });

    // Eliminar el Pedido
    const deletedPedido = await Pedido.destroy({
      where: {
        id: id,
      },
    });

    return deletedPedido;
  } catch (error) {
    console.error('Error al eliminar el pedido:', error);
    throw error;
  }
}


async function edit(id) {
  try {
    console.log("func edit");
    const pedido = await Pedido.findByPk(id, {
      include: [
        {
          model: Cliente,
          as: 'cliente', // Asegúrate de usar el alias correcto que hayas definido en las asociaciones
        },
      ],
    });

    if (!pedido) {
      throw new Error(`No se encontró el pedido con ID ${id}.`);
    }

    return pedido;
  } catch (error) {
    console.error('Error al obtener el pedido:', error);
    throw error;
  }
}


async function update(id, newData) {
  const { estado } = newData;
  
  await Pedido.update(
    {
      estado: estado,
    },
    {
      where: { id: id },
    }
  );

  // Realiza una búsqueda para obtener los datos actualizados
  const updatedPedido = await Pedido.findByPk(id);

  return updatedPedido;
}




function sendEmail(data) {
  console.log(data)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'libreriaolayahuancayo@gmail.com',
      pass: 'apcv fbvb kplt diem'
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  const mailOptions = {
    from: 'libreriaolayahuancayo@gmail.com',
    to: `${data.cliente.email}`,
    subject: 'Se está procesando tu pedido',
    text: `Estimado cliente,

Gracias por tu interés en nuestros productos. Nos complace informarte que estamos procesando tu pedido. 


Si tienes alguna pregunta o necesitas más información, no dudes en contactarnos.

Atentamente,
Tu empresa
`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error al enviar el correo electrónico:', error);
    } else {
      console.log('Correo electrónico enviado:', info.response);
    }
  });
}



function sendEmailComplt(data) {
  //console.log(data);
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'libreriaolayahuancayo@gmail.com',
      pass: 'apcv fbvb kplt diem'
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  const nombresProductos = data.productos_nombres.split(', ');
  const cantidadesProductos = data.cantidad.split(', ');
  const preciosProductos = data.productos_precios.split(', ');

  let productosDetalle = '';
  let subtotal = 0;

  for (let i = 0; i < nombresProductos.length; i++) {
    const productoDetalle = `${cantidadesProductos[i]} x ${nombresProductos[i]} - S/${preciosProductos[i]}\n`;
    subtotal += cantidadesProductos[i] * preciosProductos[i];
    productosDetalle += productoDetalle;
  }

  const igv = subtotal * 0.18;
  const total = subtotal + igv;

  const mailOptions = {
    from: 'empresaryh8@gmail.com',
    to: `${data.email}`,
    subject: 'Boleta de Venta',
    text: `Estimado cliente,

Gracias por su compra. A continuación encontrará los detalles de su pedido:

${productosDetalle}
Subtotal: S/${subtotal.toFixed(2)}
IGV (18%): S/${igv.toFixed(2)}
Total: S/${total.toFixed(2)}

Si tiene alguna pregunta o necesita más información, no dude en contactarnos.

Atentamente,
Tu empresa
`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error al enviar el correo electrónico:', error);
    } else {
      console.log('Correo electrónico enviado:', info.response);
    }
  });
}





module.exports={
    list,
    save,
    eliminar,
    update,
    sendEmail,
  sendEmailComplt,
  edit
    
}