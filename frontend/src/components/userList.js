import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UserList() {
  const [usuario, setUsuario] = useState(null);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '', password: '', rol: 'analista' });
  const [editId, setEditId] = useState(null);
  const [login, setLogin] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  // 🔐 Login
  const handleLogin = e => {
    e.preventDefault();
    axios.post('http://localhost:5001/api/usuarios/login', login)
      .then(res => setUsuario(res.data.usuario))
      .catch(() => setError('Acceso denegado'));
  };

  // 📥 Cargar usuarios
  useEffect(() => {
    if (usuario) {
      axios.get('http://localhost:5001/api/usuarios')
        .then(res => setUsers(res.data))
        .catch(err => console.error(err));
    }
  }, [usuario]);

  // 📝 Crear o actualizar usuario
  const handleSubmit = e => {
    e.preventDefault();
    const endpoint = editId
      ? `http://localhost:5001/api/usuarios/${editId}`
      : 'http://localhost:5001/api/usuarios';
    const method = editId ? 'put' : 'post';

    axios[method](endpoint, form)
      .then(() => {
        setForm({ nombre: '', email: '', telefono: '', password: '', rol: 'analista' });
        setEditId(null);
        return axios.get('http://localhost:5001/api/usuarios');
      })
      .then(res => setUsers(res.data))
      .catch(err => console.error(err));
  };

  // ✏️ Editar usuario
  const handleEdit = u => {
    setForm({ nombre: u.nombre, email: u.email, telefono: u.telefono, password: '', rol: u.rol });
    setEditId(u.id);
  };

  // ❌ Eliminar usuario
  const handleDelete = id => {
    axios.delete(`http://localhost:5001/api/usuarios/${id}`)
      .then(() => setUsers(users.filter(u => u.id !== id)))
      .catch(err => console.error(err));
  };

  // 🎨 Estilo CyberShield
  const containerStyle = { padding: '20px', fontFamily: 'sans-serif', background: '#0a192f', color: '#64ffda' };
  const inputStyle = { margin: '5px', padding: '8px', borderRadius: '4px', border: '1px solid #64ffda' };

  if (!usuario) {
    return (
      <div style={containerStyle}>
        <h2>CyberShield Login</h2>
        <form onSubmit={handleLogin}>
          <input style={inputStyle} placeholder="Email" value={login.email} onChange={e => setLogin({ ...login, email: e.target.value })} />
          <input style={inputStyle} placeholder="Password" type="password" value={login.password} onChange={e => setLogin({ ...login, password: e.target.value })} />
          <button style={inputStyle} type="submit">Ingresar</button>
        </form>
        {error && <p>{error}</p>}
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <h2>Panel de Usuarios CyberShield</h2>

      <form onSubmit={handleSubmit}>
        <input style={inputStyle} placeholder="Nombre" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} />
        <input style={inputStyle} placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        <input style={inputStyle} placeholder="Teléfono" value={form.telefono} onChange={e => setForm({ ...form, telefono: e.target.value })} />
        <input style={inputStyle} placeholder="Password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
        <select style={inputStyle} value={form.rol} onChange={e => setForm({ ...form, rol: e.target.value })}>
          <option value="analista">Analista</option>
          <option value="admin">Admin</option>
        </select>
        <button style={inputStyle} type="submit">{editId ? 'Actualizar' : 'Crear'}</button>
      </form>

      <table border="1" cellPadding="10" style={{ marginTop: '20px', background: '#ffffff', color: '#000' }}>
        <thead>
          <tr><th>ID</th><th>Nombre</th><th>Email</th><th>Teléfono</th><th>Acciones</th></tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.nombre}</td>
              <td>{u.email}</td>
              <td>{u.telefono}</td>
              <td>
                <button onClick={() => handleEdit(u)}>✏️</button>
                <button onClick={() => handleDelete(u.id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserList;