const express  = require("express");

const router=express.Router();

const aunth=require("../middleware/authMiddleware")
const { registerUser, loginUser } = require('../middleware/auth');
//const categoriasController=require('../api/customerApiController');
//const carritoController = require('../api/carritoController');

// router.get('/categorias-json', async function(req, res) {
//     try {
//         //const categorias=await categoriasController.listJSONC();
//         const categorias=
//         res.status(200).json(categorias);
//     } catch (err) {
//         res.status(500).send(err);
//     }
// });
router.get('/categorias-json',aunth, async function(req, res) {
    try {
        const categorias = [
            { "id": 1, "nombre": "Electrónica" },
            { "id": 2, "nombre": "Ropa" },
            { "id": 3, "nombre": "Hogar" },
            { "id": 4, "nombre": "Deportes" }
        ];

        res.status(200).json(categorias);
    } catch (err) {
        res.status(500).send(err);
    }
});


router.get('/productos-json', async function(req, res) {
    try {
        const productos=await categoriasController.listJSONP();
        res.status(200).json(productos);
    } catch (err) {
        res.status(500).send(err);
    }
});


// router.post('/carrito/add', async function(req, res) {
//   try {
//     const productoId = req.body.productoId; // Leer el valor del productoId desde el cuerpo de la solicitud

//     // Comprobar que productoId no sea nulo o indefinido
//     if (!productoId) {
//       res.status(400).send("Falta el identificador del producto en el carrito.");
//       return;
//     }

//     console.log('Datos recibidos en la solicitud:', { productoId });
//     const carritoActualizado = await carritoController.save(productoId, req, res); // Llamar a la función "agregarProductoAlCarrito" del controlador de carrito, pasando productoId como argumento

//     console.log("carrito desde agregar:", carritoActualizado);
//     res.status(200).json(carritoActualizado); // Enviar el carrito actualizado como respuesta
//   } catch (err) {
//     console.log("Error en backend: ", err);
//     res.status(500).send(err + "backend");
//   }
// });

// // Ruta para listar los productos del carrito

// router.get('/carrito', async function(req, res) {
//   try {
//     const carritoConProductos = await carritoController.listarCarrito(req, res);
//     console.log("Contenido del carrito con productos:", carritoConProductos);
//   } catch (err) {
//     console.log("Error en la ruta /carrito: ", err);
//     return res.status(500).send("Error al obtener el contenido del carrito.");
//   }
// });


// router.post('/register', registerUser);
// router.post('/login', loginUser);


// router.get("/carrito", carritoController.list);
// router.get("/carrito/delete/:productoId", carritoController.deleteProduct);

// router.post("/carrito/add", carritoController.save);













module.exports=router;
