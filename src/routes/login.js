const express = require("express");
const router = express.Router();

const { registerUser, loginUser } = require('../middleware/auth');



router.post('/admin/register', registerUser);



router.post('/admin/login', loginUser);



module.exports=router;