const express = require('express');
const router = express.Router();
const usuarios = require('../usuarios');

router.get('/', usuarios.listar);
router.get('/:id', usuarios.obtener);
router.post('/', usuarios.crear);
router.put('/:id', usuarios.actualizar);
router.delete('/:id', usuarios.eliminar);
router.post('/login', usuarios.login);

module.exports = router;

const db = require('./config/database');

exports.listar = (req, res) => {
  db.query('SELECT id, nombre, email, telefono, rol FROM usuarios ORDER BY id DESC', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

exports.obtener = (req, res) => {
  db.query('SELECT * FROM usuarios WHERE id = ?', [req.params.id], (err, results) => {
    if (err || results.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(results[0]);
  });
};

exports.crear = (req, res) => {
  const { nombre, email, telefono, password, rol } = req.body;
  db.query(
    'INSERT INTO usuarios (nombre, email, telefono, password, rol) VALUES (?, ?, ?, ?, ?)',
    [nombre, email, telefono, password, rol || 'analista'],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: result.insertId });
    }
  );
};

exports.actualizar = (req, res) => {
  const { nombre, email, telefono } = req.body;
  db.query(
    'UPDATE usuarios SET nombre=?, email=?, telefono=? WHERE id=?',
    [nombre, email, telefono, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Usuario actualizado' });
    }
  );
};

exports.eliminar = (req, res) => {
  db.query('DELETE FROM usuarios WHERE id=?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Usuario eliminado' });
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;
  db.query('SELECT * FROM usuarios WHERE email=? AND password=?', [email, password], (err, results) => {
    if (err || results.length === 0) return res.status(401).json({ error: 'Credenciales inválidas' });
    res.json({ usuario: results[0] });
  });
};