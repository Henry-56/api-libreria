const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Persona } = require('../models/personas');
const { Cliente } = require('../models/clientes');

exports.registerUser = async (req, res) => {
  const { nombre, apellido, fecha_nacimiento, email, password } = req.body;

  try {
    const userExists = await Cliente.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: 'El correo electrónico ya está registrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const persona = await Persona.create({ nombre, apellido, fecha_nacimiento });
    const cliente = await Cliente.create({ persona_id: persona.id, email, password: hashedPassword });

    if (!cliente) {
      throw new Error('El cliente no se creó correctamente');
    }
    
    res.json({ message: 'Registro exitoso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body)

  try {
    const cliente = await Cliente.findOne({ where: { email }, include: Persona });
    if (!cliente) {
      return res.status(400).json({ message: 'El correo electrónico o la contraseña son incorrectos' });
    }

    const isMatch = await bcrypt.compare(password, cliente.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'El correo electrónico o la contraseña son incorrectos' });
    }

    const token = jwt.sign({ clientId: cliente.id, nombre: cliente.persona.nombre, email }, 'your-secret-key', { expiresIn: '1h' });
    res.json({ token, message: 'Inicio de sesión exitoso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.sendStatus(401);
  }

  jwt.verify(token, 'your-secret-key', (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }

    req.user = user;
    next();
  });
};
