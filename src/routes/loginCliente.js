const express = require("express");
const router = express.Router();

const { registerUser, loginUser } = require('../middleware/authCliente');



router.post('/cliente/register', registerUser);



router.post('/cliente/login', loginUser);



module.exports=router;