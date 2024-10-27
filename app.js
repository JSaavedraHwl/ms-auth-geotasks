// app.js
const express = require('express');
const app = express();
const authController = require('./controllers/authController');
const authMiddleware = require('./middleware/authMiddleware');

// Configuración del puerto
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Rutas de autenticación
app.post('/register', authController.register);
app.post('/login', authController.login);

// Ruta protegida de ejemplo
app.get('/protected', authMiddleware, (req, res) => {
  res.status(200).json({ message: 'Acceso a ruta protegida concedido', user: req.user });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
