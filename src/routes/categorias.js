const express  = require("express");
const router=express.Router();

const categoriasController=require('../controllers/categoriasController');



//TOKEN

//ADIMIN

//USUIARIOS FINALES


router.post('/categorias/add', async function(req, res) {
    try {
    
      const data  = req.body;
      await categoriasController.save(data);
      res.status(200).send('Los datos se guardaron exitosamente');
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
       res.status(200).json(Categorias);
   } catch (err) {
     res.status(500).send(err);
   }
 });

router.get('/categorias/delete/:id', async function(req, res) {
  try {
    const id = req.params.id;
    await categoriasController.eliminar(id);
    res.status(200).send('Los datos se eliminaron exitosamente');
  } catch (err) {
    res.status(500).send(err);
  }
});


router.get('/categorias/update/:id', async function(req, res) {
  try {
    const { id } = req.params;
    const Categoria = await categoriasController.edit(id);
    res.status(200).json(Categoria);
  } catch (err) {
    res.status(500).send(err);
  }
});


router.post('/categorias/update/:id', async function(req, res) {
  try {
    const {id} = req.params;
    
    const newCategorias=req.body;
    await categoriasController.updatee(id, newCategorias);
    res.status(200).send('Los datos se actualizaron exitosamente');
  } catch (err) {
    res.status(500).send(err);
  }
});






module.exports=router;