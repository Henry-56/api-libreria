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

    // Utilizar findAll con la condición para buscar todos los registros que cumplan la condición
    const detallePedidos = await DetallePedido.findAll({
      where: { pedidos_id: id },
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
    console.error('Error al obtener los pedidos:', error);
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
  console.log(data);

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

  let productosDetalle = '';
  let subtotal = 0;

  data.forEach(pedido => {
    pedido.productos.forEach(producto => {
      const productoDetalle = `${producto.cantidad} x ${producto.nombre} - S/${producto.precio} =S/${producto.cantidad*producto.precio}\n`;
      subtotal += producto.cantidad * parseFloat(producto.precio);
      productosDetalle += productoDetalle;
    });

    const mailOptions = {
      from: 'libreriaolayahuancayo@gmail.com',
      to: pedido.cliente.email,
      subject: 'Se está procesando tu pedido',
      text: `Estimado cliente,

Gracias por tu interés en nuestros productos. Nos complace informarte que estamos procesando tu pedido. A continuación, detallaremos tu pedido:


Fecha del Pedido: ${pedido.pedido.fecha_pedido}
Costo Total: S/${subtotal}
Estado del Pedido: ${pedido.pedido.estado}

Productos:
${productosDetalle}

Dirección de Envío:
${pedido.cliente.direccion_envio.direccion}
Teléfono de Contacto: ${pedido.cliente.direccion_envio.telefono}


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
  });
}



function sendEmailComplt(data) {
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

  data.forEach(pedido => {
    const factura = generarBoleta(pedido);

    const mailOptions = {
      from: 'libreriaolayahuancayo@gmail.com',
      to: pedido.cliente.email,
      subject: 'Se completó tu pedido',
      text: `Estimado cliente,

Gracias por tu interés en nuestros productos. Nos complace informarte que tu pedido ha sido completado con éxito. A continuación, adjuntamos el comprobante de tu compra:

${factura}

Dirección de Envío:
${pedido.cliente.direccion_envio.direccion}
Teléfono de Contacto: ${pedido.cliente.direccion_envio.telefono}

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
  });
}


function agruparProductosYPedidos(detallePedidos) {
  const productosAgrupados = [];

  if (detallePedidos && Array.isArray(detallePedidos)) {
    detallePedidos.forEach(item => {
      const existingPedido = productosAgrupados.find(pedidoGroup => pedidoGroup.pedido.id === item.pedido.id);

      if (existingPedido) {
        if (!existingPedido.productos) {
          existingPedido.productos = [];
        }
        existingPedido.productos.push({
          id: item.producto.id,
          nombre: item.producto.nombre,
          descripcion: item.producto.descripcion,
          precio: item.producto.precio,
          cantidad: item.cantidad,
          // Otros campos del producto que deseas incluir
        });
      } else {
        const pedido = {
          pedido: {
            id: item.pedido.id,
            fecha_pedido: item.pedido.fecha_pedido,
            costo: item.pedido.costo,
            estado: item.pedido.estado,
            // Otros campos del pedido que deseas incluir
          },
          cliente: {
            id: item.pedido.cliente.id,
            email: item.pedido.cliente.email,
            direccion_envio: {
              id: item.pedido.cliente.direccion_envio ? item.pedido.cliente.direccion_envio.id : '',
              direccion: item.pedido.cliente.direccion_envio ? item.pedido.cliente.direccion_envio.direccion : '',
              telefono: item.pedido.cliente.direccion_envio ? item.pedido.cliente.direccion_envio.telefono : '',
              fecha_nacimiento: item.pedido.cliente.direccion_envio ? item.pedido.cliente.direccion_envio.fecha_nacimiento : ''
            },
            persona: {
              id: item.pedido.cliente.persona.id,
              nombre: item.pedido.cliente.persona.nombre,
              apellido: item.pedido.cliente.persona.apellido,
              fecha_nacimiento: item.pedido.cliente.persona.fecha_nacimiento
            },
          },
          productos: [{
            id: item.producto.id,
            nombre: item.producto.nombre,
            descripcion: item.producto.descripcion,
            precio: item.producto.precio,
            cantidad: item.cantidad,
            // Otros campos del producto que deseas incluir
          }]
        };

        productosAgrupados.push(pedido);
      }
    });
  }

  return productosAgrupados;
}





function generarBoleta(pedido) {
  let factura = '';

  // Encabezado de la boleta
  factura += '---------------------------------------\n';
  factura += '          COMPROBANTE DE PAGO\n';
  factura += '---------------------------------------\n';

  // Información del cliente
  
  factura += `Dirección de Envío: ${pedido.cliente.direccion_envio.direccion}\n`;
  factura += `Teléfono: ${pedido.cliente.direccion_envio.telefono}\n`;

  // Detalles de los productos
  factura += '---------------------------------------\n';
  factura += 'Descripción        |  Cantidad   |  Precio  |  Total\n';
  factura += '---------------------------------------\n';

  let subtotal = 0;

  pedido.productos.forEach(producto => {
    const precioUnitario = parseFloat(producto.precio);
    const cantidad = producto.cantidad;
    const totalProducto = precioUnitario * cantidad;
    
    factura += `${producto.nombre.padEnd(20)}|  ${cantidad.toString().padEnd(12)}|  S/${precioUnitario.toFixed(2).padEnd(8)}|  S/${totalProducto.toFixed(2)}\n`;
    
    subtotal += totalProducto;
  });

  // Total y pie de página
  factura += '---------------------------------------\n';
  factura += `Subtotal: S/${subtotal.toFixed(2)}\n`;
  factura += '---------------------------------------\n';
  factura += 'Gracias por su compra!\n';

  return factura;
}




module.exports={
    list,
    save,
    eliminar,
    update,
    sendEmail,
  sendEmailComplt,
  edit,
  agruparProductosYPedidos
    
}