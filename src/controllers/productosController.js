
const { Producto } = require('../models/productos');
const { ProductoPicture } = require('../models/productosPictures');
const { Categoria } = require('../models/categorias');
const { ProductoCategoria } = require('../models/productosCategoria');
    
function list() {
  return ProductoCategoria.findAll({
    include: [
      {
        model: Categoria,
        as: 'categoria',
      },
      {
        model: Producto,
        as: 'producto',
        include: [
          {
            model: ProductoPicture,
            as: 'producto_pictures',
          }
        ]
      }
    ]
  });
}





async function save(data, image) {
  // Convertir los campos numéricos de cadena a valores numéricos
  const precio = parseFloat(data.precio);
  const cantidad = parseInt(data.cantidad);

  // Buscar el producto por nombre (puedes ajustar el criterio de búsqueda según tus necesidades)
  const existingProduct = await Producto.findOne({ where: { nombre: data.nombre } });

  let producto;

  if (existingProduct) {
    // Actualizar el producto existente
    await existingProduct.update({
      descripcion: data.descripcion,
      precio: precio,
      cantidad: cantidad
    });

    producto = existingProduct;
  } else {
    // Crear un nuevo producto
    producto = await Producto.create({
      nombre: data.nombre,
      descripcion: data.descripcion,
      precio: precio,
      cantidad: cantidad
    });
  }

  // Guardar la imagen en el modelo ProductoPicture
  await ProductoPicture.create({
    producto_id: producto.id,
    img_url: image
  });

  // Guardar el nombre y tipo en la categoría
  const categoria = await Categoria.create({
    nombre: data.nombreCategoria,
    tipo: data.tipo
  });

  // Crear la relación entre el producto y la categoría en la tabla ProductoCategoria
  await ProductoCategoria.create({
    producto_id: producto.id,
    categoria_id: categoria.id
  });

  console.log(producto);
  return producto;
}

function eliminar(id) {
  return ProductoCategoria.destroy({
    where: {
      id: id
    },
  });
};


async function edit(id) {
  const productoCategoria = await ProductoCategoria.findByPk(id, {
    include: [
      {
        model: Producto,
        as: 'producto',
        include: [
          {
            model: ProductoPicture,
            as: 'producto_pictures',
          }
        ]
      },
      {
        model: Categoria,
        as: 'categoria',
      },
    ],
  });

  if (!productoCategoria) {
    throw new Error('ProductoCategoria no encontrado');
  }

  console.log(productoCategoria);
  return productoCategoria;
}




async function update(id, data, image) {
  console.log(image);
  // Convertir los campos numéricos de cadena a valores numéricos
  const precio = parseFloat(data.precio);
  const cantidad = parseInt(data.cantidad);

  // Actualizar el producto en la tabla Producto
  const productoCategoria = await ProductoCategoria.findByPk(id);
  if (!productoCategoria) {
    throw new Error('ProductoCategoria no encontrado');
  }

  const productoId = productoCategoria.producto_id;
  await Producto.update(
    {
      nombre: data.nombre,
      descripcion: data.descripcion,
      precio: precio,
      cantidad: cantidad,
    },
    {
      where: { id: productoId },
    }
  );

  // Guardar la imagen en el modelo ProductoPicture si `image` no está vacía
  if (image !== '') {
    await ProductoPicture.update(
      {
        img_url: image,
      },
      {
        where: { producto_id: productoId },
      }
    );
  }

  // Actualizar el nombre y tipo en la categoría
  const categoriaId = productoCategoria.categoria_id;
  await Categoria.update(
    {
      nombre: data.nombreCategoria,
      tipo: data.tipo,
    },
    {
      where: { id: categoriaId },
    }
  );

  console.log(productoCategoria);
  return productoCategoria;
}



async function updateImage(productId, image) {
  // Actualizar la imagen en el modelo ProductoPicture
  await ProductoPicture.update(
    {
      img_url: image,
    },
    {
      where: { producto_id: productId },
    }
  );

  // Devolver un mensaje de éxito o cualquier otra respuesta necesaria
  return ProductoPicture;
}



function listImg() {
  return ProductoPicture.findAll();
}


module.exports={
    list,
    save,
    eliminar,
    edit,
    update,
    updateImage,
    listImg    
}