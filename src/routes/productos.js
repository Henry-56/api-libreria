const express  = require("express");
const router=express.Router();

const productosController=require('../controllers/productosController');
const categoriasController=require('../controllers/categoriasController');

const midellwareImg= require('../middleware/productos');


router.get('/productos', async function(req, res) {
    try {
      const productos =await productosController.list();
      const categorias = await categoriasController.list();
      res.render('productos',{
        productos: productos,
        categorias: categorias
    });
    } catch (err) {
      res.status(500).send(err);
    }
  });


router.post('/productos/add',midellwareImg, async function(req, res) {
    try {
      const nameDominio='http://localhost:3000';
      const Image= nameDominio+'/uploads/productos/'+req.file.originalname;;
      const data  = req.body;
      const color = req.body.color[0]; // obtener el primer elemento del arreglo
      data.color = color;
      await productosController.save(data,Image);
      res.redirect('/productos');
      
    } catch (err) {
      
      res.status(500).send(err);
    }
  });


router.get('/productos/delete/:id', async function(req, res) {
  try {
    const id = req.params.id;
    await productosController.eliminar(id);
    res.redirect('/productos');
    
  } catch (err) {
    res.status(500).send(err);
  }
});


router.get('/productos/update/:id', async function(req, res) {
  try {
    const { id } = req.params;
    const productos=await productosController.edit(id);
    const categorias = await categoriasController.list();
    res.render('productos_edit',{
      data: productos[0],
      categorias: categorias
  });
  } catch (err) {
    res.status(500).send(err);
  }
});


router.post('/carrito/agregar', async function(req, res) {
  try {
    const data = req.body;
    const productoId = data.productoId;
    const cantidad = data.cantidad;
    const resultado = await carritoController.save({productoId, cantidad});
    res.json(resultado);
  } catch (error) {
    console.error(error);
    res.status(500).send('Ha ocurrido un error al agregar el producto al carrito');
  }
});





module.exports=router;