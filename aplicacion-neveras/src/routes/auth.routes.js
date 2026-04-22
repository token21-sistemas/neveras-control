import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { pool } from '../db.js';
import { authRequired } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/role.middleware.js';

dotenv.config();

const router = express.Router();

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        ok: false,
        error: 'Username y password son obligatorios',
      });
    }

    const result = await pool.query(
      `SELECT id, username, nombre_completo, password_hash, rol, activo
       FROM usuarios
       WHERE username = $1`,
      [username]
    );

    if (result.rowCount === 0) {
      return res.status(401).json({
        ok: false,
        error: 'Usuario o contraseña incorrectos',
      });
    }

    const user = result.rows[0];

    if (!user.activo) {
      return res.status(403).json({
        ok: false,
        error: 'Usuario inactivo',
      });
    }

    const passwordOk = await bcrypt.compare(password, user.password_hash);

    if (!passwordOk) {
      return res.status(401).json({
        ok: false,
        error: 'Usuario o contraseña incorrectos',
      });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        ok: false,
        error: 'Falta configurar JWT_SECRET en el archivo .env',
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        nombre_completo: user.nombre_completo,
        rol: user.rol,
      },
      process.env.JWT_SECRET,
      { expiresIn: '12h' }
    );

    return res.json({
      ok: true,
      message: 'Login correcto',
      token,
      user: {
        id: user.id,
        username: user.username,
        nombre_completo: user.nombre_completo,
        rol: user.rol,
      },
    });
  } catch (error) {
    console.error('Error en /login:', error);

    return res.status(500).json({
      ok: false,
      error: 'Error interno en login',
    });
  }
});

// CREAR USUARIO - SOLO ADMIN
router.post('/register', authRequired, requireAdmin, async (req, res) => {
  try {
    const {
      username,
      nombre_completo,
      password,
      rol = 'usuario',
      activo = true,
    } = req.body;

    if (!username || !nombre_completo || !password) {
      return res.status(400).json({
        ok: false,
        error: 'Username, nombre completo y contraseña son obligatorios',
      });
    }

    if (!['admin', 'usuario'].includes(rol)) {
      return res.status(400).json({
        ok: false,
        error: 'Rol no válido',
      });
    }

    const existe = await pool.query(
      `SELECT id FROM usuarios WHERE username = $1`,
      [username]
    );

    if (existe.rowCount > 0) {
      return res.status(409).json({
        ok: false,
        error: 'Ya existe un usuario con ese username',
      });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO usuarios (
        username,
        nombre_completo,
        password_hash,
        rol,
        activo
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, username, nombre_completo, rol, activo`,
      [username, nombre_completo, password_hash, rol, activo]
    );

    return res.status(201).json({
      ok: true,
      message: 'Usuario creado correctamente',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error en /register:', error);

    return res.status(500).json({
      ok: false,
      error: 'Error creando usuario',
      detail: error.message,
    });
  }
});

export default router;