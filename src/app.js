const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors'); // Importar cors

const app = express();

// Configurar body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Habilitar CORS
app.use(cors());

// importando rutas
const categoriaRoutes = require('./routes/categorias');
const loginRoutes = require('./routes/login');
const productosRoutes = require('./routes/productos');
const ApiCustomerRoutes = require('./routes/customerApi');

// ...

// seteando views
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// rutas
app.use('/', loginRoutes);
app.use('/', categoriaRoutes);
app.use('/', productosRoutes);
app.use('/', ApiCustomerRoutes);

// archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// iniciar servidor
app.listen(app.get('port'), () => console.log(`Example app listening on port ${app.get('port')}`));
