const { Categoria } = require('../models/categorias');
    
function list() {
    return Categoria.findAll();
};

 function save(data) {
  // save user data
   return Categoria.create({ 
    nombre: data.nombre,
    tipo: data.tipo,
   });
};

 function eliminar(id) {
  return Categoria.destroy({
    where: {
      id: id
    },
  })
};

function edit(id) {
  return Categoria.findAll({
    where: {
      id: id
    },
  })
};


function updatee(id, newCategorias) {
  return Categoria.update(
    { 
      nombre: newCategorias.nombre,
      tipo: newCategorias.tipo,
      
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