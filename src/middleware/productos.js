function productoMiddleware(req, res, next) {
  const multer = require('multer');

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'src/public/uploads/productos')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  });

  const upload = multer({ storage: storage });

  upload.array('img_url', 5)(req, res, function (err) {
    if (err) {
      // Ignorar el error y continuar con la ejecución
      console.log('No se proporcionó ninguna imagen en la solicitud');
    }
    next();
  });
}

module.exports = productoMiddleware;

  