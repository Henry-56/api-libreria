const { DireccionEnvio } = require('../models/direccionEnvio');
const { Cliente } = require('../models/clientes');

function list() {
    return DireccionEnvio.findAll();
};

async function save(data, id) {
  try {
    console.log('Iniciando función save...');
    
    // Encuentra el cliente existente por su ID
    const cliente = await Cliente.findByPk(id);

    if (!cliente) {
      throw new Error('Cliente no encontrado');
    }
    
    console.log('Cliente encontrado:', cliente.toJSON());

    // Crea una nueva dirección de envío
    const nuevaDireccion = await DireccionEnvio.create({
      direccion: data.direccion,
      telefono: data.telefono
    });

    console.log('Nueva dirección creada:', nuevaDireccion.toJSON());

    // Actualiza la columna direccion_id en el cliente con el ID de la nueva dirección
    await cliente.update({ direccion_id: nuevaDireccion.id });

    console.log('Dirección de envío asociada al cliente.');

    return nuevaDireccion;
  } catch (error) {
    console.error('Error al guardar la dirección de envío:', error.message);
    throw new Error('Error al guardar la dirección de envío: ' + error.message);
  }
}



 function eliminar(id) {
  return DireccionEnvio.destroy({
    where: {
      id: id
    },
  })
};

function edit(id) {
  return DireccionEnvio.findAll({
    where: {
      id: id
    },
  })
};







module.exports={
    list,
    save,
    eliminar,
    edit,
    
}