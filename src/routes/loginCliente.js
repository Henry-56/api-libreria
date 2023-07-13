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

  

module.exports=router;