const express = require('express');
const cors = require('cors');
const usuariosRoutes = require('./routes/usuarios');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/usuarios', usuariosRoutes);

app.get('/', (req, res) => {
  res.json({ message: '🛡️ CyberShield API activa' });
});

app.listen(5001, () => {
  console.log('🚀 Servidor CyberShield en http://localhost:5001');
});

router.get('/', usuarios.listar);
router.post('/login', usuarios.login);
// ... otras rutas

module.exports = router;
