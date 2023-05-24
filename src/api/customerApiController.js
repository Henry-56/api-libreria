

function listJSONC() {
    return Categorias.findAll();
};


function listJSONP() {
  return Productos.findAll();
};



module.exports={
    listJSONC,
    listJSONP

}

   