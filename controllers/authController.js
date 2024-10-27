// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');

// Ruta del archivo JSON de usuarios
const usersFilePath = './users.json';
let users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));

// Generar un token JWT
const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, 'your_jwt_secret', { expiresIn: '1h' });
};

// Registro de usuario
exports.register = (req, res) => {
  const { email, password } = req.body;

  // Verificar si el usuario ya existe
  if (users.find(user => user.email === email)) {
    return res.status(400).json({ message: 'El usuario ya está registrado.' });
  }

  // Cifrar la contraseña
  const hashedPassword = bcrypt.hashSync(password, 10);

  // Crear el nuevo usuario y guardarlo
  const newUser = { id: Date.now(), email, password: hashedPassword };
  users.push(newUser);
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));

  res.status(201).json({ message: 'Usuario registrado con éxito', user: { id: newUser.id, email: newUser.email } });
};

// Login de usuario
exports.login = (req, res) => {
  const { email, password } = req.body;

  // Buscar el usuario en la lista
  const user = users.find(user => user.email === email);
  if (!user) {
    return res.status(400).json({ message: 'Usuario o contraseña incorrectos.' });
  }

  // Comparar la contraseña
  const isPasswordValid = bcrypt.compareSync(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: 'Usuario o contraseña incorrectos.' });
  }

  // Generar token
  const token = generateToken(user);

  res.status(200).json({ message: 'Inicio de sesión exitoso', token });
};
