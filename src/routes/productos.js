const express  = require("express");
const router=express.Router();

const productosController=require('../controllers/productosController');


const midellwareImg= require('../middleware/productos');


router.get('/productos', async function(req, res) {
  try {
    const productos = await productosController.list();

    res.status(200).json(productos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



router.post('/productos/add', midellwareImg, async function(req, res) {
  try {
    console.log("asdpost p")
    let Image = ''; // Variable para almacenar la imagen (vacía por defecto)
    if (req.file && req.file.originalname) {
      const hostname = req.hostname; // Obtener el nombre del host actual
      const protocol = req.protocol; // Obtener el protocolo utilizado (http o https)
      Image = `${protocol}://${hostname}/uploads/productos/${req.file.originalname}`;
    }
    const data = req.body;
    console.log(data);
    console.log(Image);
    
    await productosController.save(data, Image);

    // Enviar mensaje de éxito
    res.status(200).send('Los datos se guardaron exitosamente');
  } catch (err) {
    res.status(500).send(err);
  }
});

  




router.get('/productos/update/:id', async function(req, res) {
  try {
    const { id } = req.params;
    const productos = await productosController.edit(id);
  
    res.status(200).json(productos);
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

router.post('/productos/update/:id', midellwareImg, async function(req, res) {
  try {
    console.log("Ya pasaste el middleware");
    const { id } = req.params;
    let Image = ''; // Variable para almacenar la imagen (vacía por defecto)
    if (req.file && req.file.originalname) {
      const hostname = req.hostname; // Obtener el nombre del host actual
      const protocol = req.protocol; // Obtener el protocolo utilizado (http o https)
      Image = `${protocol}://${hostname}/uploads/productos/${req.file.originalname}`;
    }
    const data = req.body;
    console.log("la img es : "+Image)
    await productosController.update(id, data, Image);
    res.status(200).send('Los datos se actualizaron exitosamente');
  } catch (err) {
    res.status(500).send(err);
  }
});


router.get('/productos/delete/:id', async function(req, res) {
  try {
    const id = req.params.id;
    await productosController.eliminar(id);
    res.status(200).send('Los datos se eliminaron exitosamente');
  } catch (err) {
    res.status(500).send(err);
  }
});

// router.post('/carrito/agregar', async function(req, res) {
//   try {
//     const data = req.body;
//     const productoId = data.productoId;
//     const cantidad = data.cantidad;
//     const resultado = await carritoController.save({productoId, cantidad});
//     res.json(resultado);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Ha ocurrido un error al agregar el producto al carrito');
//   }
// });





module.exports=router;