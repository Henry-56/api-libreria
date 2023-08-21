const bcrypt = require('bcrypt');
const { Persona } = require('../models/personas');
const { Cliente } = require('../models/clientes');
const { DireccionEnvio } = require('../models/direccionEnvio');






function list(id) {
    return Cliente.findOne({
      where: {
        id: id
      },
      include: [
        {
          model: Persona,
          as: 'persona',
        }
      ]
    });
  }

  async function listCliente() {
    try {
      const clientes = await Cliente.findAll({
        include: [
          {
            model: DireccionEnvio,
            as: 'direccion_envio', // Asegúrate de que el alias coincida con el que has definido en la asociación
          },
          {
            model: Persona,
            as: 'persona', // Asegúrate de que el alias coincida con el que has definido en la asociación
          },
        ],
      });
      return clientes;
    } catch (error) {
      console.error("Error while fetching clients: ", error);
      throw error;
    }
  }

  async function updateData(id, newData) {
    const { nombre, apellido, fecha_nacimiento, email } = newData;
  
    const updatedPersona = await Persona.update(
      {
        nombre: nombre,
        apellido: apellido,
        fecha_nacimiento: fecha_nacimiento,
      },
      {
        where: { id: id },
      }
    );
  
    const updatedCliente = await Cliente.update(
      {
        email: email,
      },
      {
        where: { id: id },
      }
    );
  
    const personaActualizada = await Persona.findByPk(id);
    const clienteActualizado = await Cliente.findByPk(id);
  
    return { personaActualizada, clienteActualizado };
  }
  
  
  async function comparePasswords(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }
  
  async function updatePassaword(id, oldPassword, newPassword) {
    // Buscar el cliente por ID
    const cliente = await Cliente.findByPk(id);
  
    // Verificar si la contraseña antigua coincide
    const isPasswordValid = await comparePasswords(oldPassword, cliente.password);
    if (!isPasswordValid) {
      throw new Error("La contraseña antigua no es válida.");
    }
  
    // Hash o cifra la nueva contraseña aquí
    const hashedPassword = await bcrypt.hash(newPassword, 10);
  
    // Actualiza la contraseña en el modelo Cliente
    const updatedCliente = await Cliente.update(
      {
        password: hashedPassword,
      },
      {
        where: { id: id },
      }
    );
  
    const clienteActualizado = await Cliente.findByPk(id);
    return clienteActualizado;
  }
  
  
  module.exports={
    list,
    listCliente,
    updateData,
    updatePassaword
    
}