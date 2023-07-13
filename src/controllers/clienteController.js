const { Persona } = require('../models/personas');
const { Cliente } = require('../models/clientes');

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

  function listCliente() {
    return Cliente.findAll(
      {
        include:[
          {
            model: Persona,
            as: 'persona',
          }
        ]
      }
    );
  }

  module.exports={
    list,
    listCliente
    
}