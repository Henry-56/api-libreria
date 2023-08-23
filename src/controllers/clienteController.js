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
        },
        {
          model: DireccionEnvio,
          as: 'direccion_envio', // Asegúrate de que el alias coincida con el que has definido en la asociación
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
  
    // Actualizar datos en la tabla Cliente
    const updatedCliente = await Cliente.update(
      {
        email: email,
      },
      {
        where: { id: id },
      }
    );
  
    // Verificar si el cliente se actualizó con éxito
    if (updatedCliente[0] === 0) {
      return null; // El cliente no se encontró o no se actualizó
    }
  
    // Obtener el cliente actualizado para obtener el persona_id
    const clienteActualizado = await Cliente.findByPk(id);
    const personaId = clienteActualizado.persona_id;
  
    // Actualizar datos en la tabla Persona
    const updatedPersona = await Persona.update(
      {
        nombre: nombre,
        apellido: apellido,
        fecha_nacimiento: fecha_nacimiento,
      },
      {
        where: { id: personaId },
      }
    );
  
    // Verificar si la persona se actualizó con éxito
    if (updatedPersona[0] === 0) {
      return null; // La persona no se encontró o no se actualizó
    }
  
    // Obtener la persona actualizada
    const personaActualizada = await Persona.findByPk(personaId);
  
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