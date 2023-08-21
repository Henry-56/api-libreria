const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Persona } = require('../models/personas');
const { Usuario } = require('../models/usuarios');

exports.registerUser = async (req, res) => {
  const { nombre, apellido, fecha_nacimiento, email, password, rol } = req.body;

  try {
    const userExists = await Usuario.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: 'El correo electrónico ya está registrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const persona = await Persona.create({ nombre, apellido, fecha_nacimiento });
    const usuario = await Usuario.create({ persona_id: persona.id, email, password: hashedPassword, rol });

    if (!usuario) {
      throw new Error('El usuario no se creó correctamente');
    }
    
    
    res.json({ message: 'Registro exitoso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);

  try {
    const usuario = await Usuario.findOne({ where: { email }, include: Persona });
    if (!usuario) {
      return res.status(400).json({ message: 'El correo electrónico o la contraseña son incorrectos' });
    }

    const isMatch = await bcrypt.compare(password, usuario.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'El correo electrónico o la contraseña son incorrectos' });
    }

    const token = jwt.sign(
      {
        userId: usuario.id,
        nombre: usuario.persona.nombre,
        apellido: usuario.persona.apellido,
        fecha_nacimiento: usuario.persona.fecha_nacimiento,
        email,
      },
      'your-secret-key',
      { expiresIn: '1h' }
    );
    
    res.json({ 
      token,
      user: {
        nombre: usuario.persona.nombre,
        apellido: usuario.persona.apellido,
        fecha_nacimiento: usuario.persona.fecha_nacimiento,
        email,
      },
      message: 'Inicio de sesión exitoso'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};
