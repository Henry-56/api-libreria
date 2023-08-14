const express  = require("express");
const router=express.Router();

const dirreccionEnvioController=require('../controllers/direccionEnvioController');
const pedidosController=require('../controllers/pedidosController');



//TOKEN
const { authenticateToken } = require('../middleware/authCliente');
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





router.post('/pedidos/add', authenticateToken, async function(req, res) {
  try {
    const clienteId = req.user.clientId; // Obtener el ID del cliente desde el token decodificado en el middleware
    const data = req.body;
    const productos = data.productos; // Supongo que los productos están en un array llamado "productos" en los datos del pedido
    console.log(data);
    console.log(productos);
    console.log(clienteId);
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








module.exports=router;