const express  = require("express");
const router=express.Router();

const dirreccionEnvioController=require('../controllers/direccionEnvioController');
const pedidosController=require('../controllers/pedidosController');



//TOKEN
const { authenticateToken } = require('../middleware/authCliente');
const { Pedido } = require("../models/pedidos");
//ADIMIN

//USUIARIOS FINALES


router.post('/direccion/add',authenticateToken, async function(req, res) {
    try {

      const clienteId = req.user.clientId; // Obtener el ID del cliente desde el token decodificado en el middleware
      console.log(clienteId)
      const data  = req.body;
      console.log(data)
      await dirreccionEnvioController.save(data, clienteId);
      res.status(200).send('Los datos se guardaron exitosamente');
    } catch (err) {
      res.status(500).send(err);
    }
  });



 router.get('/direccion', async function(req, res) {
   try {
       const dirrecion = await dirreccionEnvioController.list();
       res.status(200).json(dirrecion);
       console.log(dirrecion)
   } catch (err) {
     res.status(500).send(err);
   }
 });

// Tu función list() se mantiene igual

// Actualiza tu ruta para obtener productos agrupados por pedidos_id
router.get('/pedidos-agrupados', async function(req, res) {
  try {
    const detallePedidos = await pedidosController.list();
    
    // Crear un arreglo para almacenar los productos agrupados
    const productosAgrupados = [];

    detallePedidos.forEach(item => {
      const detallePedido = { // Crear el objeto detallePedido para asignar a cada producto
        producto_id: item.producto_id,
        cantidad: item.cantidad,
        precio: item.precio,
      };
      
      const existingPedido = productosAgrupados.find(pedidoGroup => pedidoGroup.pedido.id === item.pedido.id);

      if (existingPedido) {
        if (!existingPedido.productos) {
          existingPedido.productos = []; // Inicializar el array de productos si no existe
        }
        existingPedido.productos.push({
          id: item.producto.id,
          nombre: item.producto.nombre,
          descripcion: item.producto.descripcion,
          precio: item.producto.precio,
          cantidad: item.producto.cantidad,
          detallePedidos: detallePedido, // Asignar el objeto detallePedido a cada producto
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
            cantidad: item.producto.cantidad,
            detallePedidos: detallePedido, // Asignar el objeto detallePedido a cada producto
            // Otros campos del producto que deseas incluir
          }]
        };

        productosAgrupados.push(pedido);
      }
    });

    res.status(200).json(productosAgrupados);
  } catch (err) {
    res.status(500).send(err);
    console.log(err);
  }
});







router.post('/pedidos/add', authenticateToken, async function(req, res) {
  try {
    const clienteId = req.user.clientId; // Obtener el ID del cliente desde el token decodificado en el middleware
    const data = req.body;
    const productos = data.productos; // Supongo que los productos están en un array llamado "productos" en los datos del pedido
    
    await pedidosController.save(data, productos, clienteId);
    res.status(200).send('Los datos se guardaron exitosamente');
  } catch (err) {
    res.status(500).send(err);
  }
});


router.get('/pedidos', async function(req, res) {
  try {
    console.log("en pedidoss")
      const pedidos = await pedidosController.list();
      res.status(200).json(pedidos);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get('/pedidos/delete/:id', async function(req, res) {
  try {
    const id = req.params.id;
    await pedidosController.eliminar(id);
    res.status(200).send('Los datos se eliminaron exitosamente');
  } catch (err) {
    res.status(500).send(err);
  }
});


router.post('/pedidos/update/:id', async function(req, res) {
  try {
      const id = req.params.id;
      const newData= req.body;
      console.log(newData);
      const pedido =await pedidosController.update(id, newData);
      res.status(200).json(pedido);
  } catch (err) {
    res.status(500).send(err);
  }
});







module.exports=router;