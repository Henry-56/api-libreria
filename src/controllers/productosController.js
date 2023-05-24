//const { Productos } = require('../models/productos');
    
function list() {
   return Productos.findAll();
};


function save(data, Image) {

    return Productos.create({ 
      nombre: data.nombre,
      descripcion: data.descripcion,
      precio: data.precio,
      talla: data.talla,
      cantidad: data.cantidad,
      color: data.color,
      img_url: Image,
      categoria_id: data.categoria_id
    });

};


function eliminar(id) {
  return Productos.destroy({
    where: {
      id: id
    },
  });
};


function edit(id) {
  return Productos.findAll({
    where: {
      id: id
    },
  });
};



function updatee(id, newproductos, newImagen) {
  return Productos.update(
    { 
      nombre: newproductos.nombre,
      descripcion: newproductos.descripcion,
      precio: newproductos.precio,
      talla: newproductos.talla,
      cantidad: newproductos.cantidad,
      color: newproductos.color,
      img_url: newImagen,
      categoria_id: newproductos.categoria_id
     }, // Objeto con los nuevos valores a actualizar
    { 
      where:  {id}  
    } // Objeto que especifica los registros que deben actualizarse
  );
  Productos.findByPk( id );
};





module.exports={
    list,
    save,
    eliminar,
    edit,
    updatee
    
}