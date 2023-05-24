const express  = require("express");
const router=express.Router();

const categoriasController=require('../controllers/categoriasController');



//TOKEN

//ADIMIN

//USUIARIOS FINALES


router.post('/categorias/add', async function(req, res) {
    try {
    
      const data  = req.body;
      await categoriasController.save(data, id_producto);
      res.redirect('/categorias');
    } catch (err) {
      res.status(500).send(err);
    }
  });



// router.get('/categorias', async function(req, res) {
//   try {
//     if (req.session.isLoggedIn) {
//       const Categorias = await categoriasController.list();
//       res.render('categorias',{
//       data: Categorias 
//   });
//     } else {
//       // El usuario no está autenticado, redirigirlo a la página de inicio de sesión
//       res.redirect('/login');
//     }
    
//   } catch (err) {
//     res.status(500).send(err);
//   }
// });


 router.get('/categorias', async function(req, res) {
   try {
   
       const Categorias = await categoriasController.list();
       res.render('categorias',{
       data: Categorias 
   });
   } catch (err) {
     res.status(500).send(err);
   }
 });

router.get('/categorias/delete/:id', async function(req, res) {
  try {
    const id = req.params.id;
    await categoriasController.eliminar(id);
    res.redirect('/categorias');
  } catch (err) {
    res.status(500).send(err);
  }
});


router.get('/categorias/update/:id', async function(req, res) {
  try {
    const { id } = req.params;
    const Customers = await categoriasController.edit(id);
    res.render('categorias_edit',{
      data: Customers[0]
  });
  } catch (err) {
    res.status(500).send(err);
  }
});


router.post('/categorias/update/:id', async function(req, res) {
  try {
    const {id} = req.params;
    
    const newCategorias=req.body;
    await categoriasController.updatee(id, newCategorias);
    res.redirect('/categorias');
  } catch (err) {
    res.status(500).send(err);
  }
});






module.exports=router;