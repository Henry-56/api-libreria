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
  module.exports={
    list,
    listCliente
    
}