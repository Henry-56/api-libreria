//const {Categorias} = require('../models/categorias');
    
function list() {
    return Categorias.findAll();
};

 function save(data) {
  // save user data
   return Categorias.create({ 
    nombre: data.nombre,
    descripcion: data.descripcion,
   });
};

 function eliminar(id) {
  return Categorias.destroy({
    where: {
      id: id
    },
  })
};

function edit(id) {
  return Categorias.findAll({
    where: {
      id: id
    },
  })
};


function updatee(id, newCategorias) {
  return Categorias.update(
    { 
      nombre: newCategorias.nombre,
      descripcion: newCategorias.descripcion,
      
     }, // Objeto con los nuevos valores a actualizar
    { 
      where:  {id}  
    } // Objeto que especifica los registros que deben actualizarse
  );
  Categorias.findByPk( id );
};






module.exports={
    list,
    save,
    eliminar,
    edit,
    updatee
    
}