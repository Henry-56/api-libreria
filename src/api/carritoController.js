

let globalCarrito = {};

//  async function listCarrito(carrito) {
//    const carritoIds = Object.keys(carrito);  //Obtener los ids de los productos del carrito
   

//     //Asignar las cantidades y totales del carrito a cada producto
//    const productosEnCarrito = productos.map((producto) => {
//      const cantidad = carrito[producto.id].cantidad;
//      const total = carrito[producto.id].total;
//      return { ...producto.toJSON(), cantidad, total };
//    });
//    console.log(productosEnCarrito)

//    return productosEnCarrito;
//  }



function listCarrito() {
  console.dir(globalCarrito);
  return globalCarrito;
}


function eliminar(id) {
  return Carrito.destroy({
    where: {
      id_carrito: id
    },
  })
};

// async function save(productoId, req, res) {
//   try {
//     console.log("Valor de la cookie 'carrito':", req.cookies.carrito);
//     const carrito = req.cookies.carrito ? JSON.parse(req.cookies.carrito) : [];

//     console.log("Valor de 'carrito' después de la conversión:", carrito);

//     const producto = await Productos.findByPk(productoId);

//     if (!producto) {
//       throw new Error("El producto no existe.");
//     }

//     const index = carrito.findIndex(item => item.producto.id === producto.id);
//     if (index === -1) {
//       // El producto no está en el carrito, agregarlo
//       carrito.push({ cantidad: 1, total: parseFloat(producto.precio), producto });
//     } else {
//       // El producto ya está en el carrito, actualizar cantidad y total
//       carrito[index].cantidad += 1;
//       carrito[index].total += parseFloat(producto.precio);
//     }

//     console.log("Carrito actualizado:", carrito);
    
//     res.cookie('carrito', JSON.stringify(carrito), { maxAge: 86400000 });
//     console.log('Cookie carrito establecida en la respuesta:', JSON.stringify(carrito));

//     return carrito;
//   } catch (err) {
//     console.log("Error en carritoController.save: ", err);
//     throw err;
//   }
// }





//   async function listarCarrito(req, res) {
  
//     try {
//       console.log("Valor de la cookie 'carrito':", req.cookies.carrito);
//       const carrito = req.cookies.carrito ? JSON.parse(req.cookies.carrito) : {};
      

//       console.log("Valor de 'carrito' después de la conversión:", carrito);

//       const productoIds = Object.keys(carrito);
//       console.log("Ids de productos en el carrito:", productoIds);

//       const productos = await Productos.findAll({
//         where: {
//           id: productoIds,
//         },
//       });
//       console.log("Productos encontrados en la base de datos:", productos);

//       const carritoConProductos = productoIds.map((id) => {
//         const item = carrito[id];
//         const producto = productos.find((p) => p.id === id);
//         item.producto = producto;
//         return item;
//       });
//       console.log("Carrito con productos completos:", carritoConProductos);

//       res.cookie('carrito', JSON.stringify(carritoConProductos), { maxAge: 86400000 });
//       console.log('Cookie carrito establecida en la respuesta:', JSON.stringify(carrito));

//       return res.status(200).json(carritoConProductos);
//     } catch (err) {
//       console.log("Error en carritoController.listarCarrito: ", err);
//       throw err;
//     }
//   }








// async function calcularTotal(productos) {
//   let total = 0;
//   for (let i = 0; i < productos.length; i++) {
//     total += productos[i].cantidad * productos[i].producto.precio;
//   }
//   return total;
// }

// module.exports = {
//   listCarrito,
//   listarCarrito,
//   save,
//   calcularTotal,
//   eliminar
// };




async function save(req, res) {
  try {
    const productoId = req.cookies.carrito; // Obtener el id del producto desde la cookie "carrito"
    console.log("cooke recibido exitosamente: "+productoId)
    if (!productoId) {
      throw new Error("No se encontró el id del producto en la cookie 'carrito'");
    }

    const producto = await Productos.findByPk(productoId);

    if (!producto) {
      throw new Error("El producto no existe.");
    }

    const [carrito, created] = await Carrito.findOrCreate({
      where: { id_producto: productoId },
      defaults: { cantidad: 1, total: producto.precio }
    });

    if (!created) {
      
      let cantidadTotal=carrito.cantidad++;
      carrito.total += producto.precio*cantidadTotal;
      await carrito.save();
    }
    res.status(200).send(carrito)
    return carrito;
  } catch (err) {
    console.log("Error en carritoController.save: ", err);
    throw err;
  }
}

async function list(req, res) {
  try {
    const carrito = await Carrito.findAll({ include: { model: Productos } });
    console.log(carrito)
    res.status(200).json(carrito);
  } catch (err) {
    console.log("Error en carritoController.list: ", err);
    throw err;
  }
}


async function deleteProduct(req, res) {
  
  const productId = req.params.productoId;
  console.log("el producto id es: "+productId)
  const carrito = await Carrito.findByPk(productId);

  if (!carrito) {
    res.status(404).json({ error: "El producto no está en el carrito" });
    return;
  }

  try {
    await carrito.destroy();
    res.status(200).json({ message: "El producto fue eliminado del carrito" });
  } catch (err) {
    console.log("Error en carritoController.deleteProduct: ", err);
    res.status(500).json({ error: "Ocurrió un error al eliminar el producto del carrito" });
  }
}


module.exports = { 
  save, 
  list,
  deleteProduct
};
