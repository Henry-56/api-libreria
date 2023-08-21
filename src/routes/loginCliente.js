const express = require("express");
const router = express.Router();

const { registerUser, loginUser, authenticateToken } = require('../middleware/authCliente');

const clienteController=require('../controllers/clienteController');

router.post('/cliente/register', registerUser);



router.post('/cliente/login', loginUser);

router.get('/cliente/perfil', authenticateToken, async (req, res) => {
    try {
      const clienteId = req.user.clientId; // Obtener el ID del cliente desde el token decodificado en el middleware
  
      const cliente = await clienteController.list(clienteId);

     res.status(200).json(cliente);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  });

  router.get('/cliente', async (req, res) => {
    try {
      const cliente = await clienteController.listCliente();

     res.status(200).json(cliente);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  });

  router.post('/cliente/update/passaword', authenticateToken, async (req, res) => {
    try {
      const clienteId = req.user.clientId; // Obtener el ID del cliente desde el token decodificado en el middleware
      const data = req.body;
      const oldPassword = data.oldPassword;
      const newPassword = data.newPassword;
      await clienteController.updatePassaword(clienteId, oldPassword,newPassword );

      res.status(200).send('Los datos de la contraseña se actualizaron exitosamente');
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  });


  router.post('/cliente/update', authenticateToken, async (req, res) => {
    try {
      const clienteId = req.user.clientId; // Obtener el ID del cliente desde el token decodificado en el middleware
      const data = req.body;
      await clienteController.updateData(clienteId, data );

      res.status(200).send('Los datos del cliente se actualizaron exitosamente');
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  });

  

module.exports=router;