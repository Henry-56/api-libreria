const { DireccionEnvio } = require('../models/direccionEnvio');
    
function list() {
    return DireccionEnvio.findAll();
};

 function save(data, id) {
  // save user data
   return DireccionEnvio.create({ 
    cliente_id: id,
    nombre: data.nombre,
    apellido: data.apellido,
    compania: data.compania,
    correo: data.correo,
    telefono:data.telefono,
    pais: data.pais,
    ciudad: data.ciudad,
    provincia: data.provincia,
    codigo_postal: data.codigo_postal,
    direccion: data.direccion
   });
};

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