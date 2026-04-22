import express from 'express';
import bcrypt from 'bcrypt';
import { pool } from '../db.js';
import { authRequired } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/role.middleware.js';

const router = express.Router();

// Listar usuarios - solo admin
router.get('/', authRequired, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        username,
        nombre_completo,
        rol,
        activo
      FROM usuarios
      ORDER BY username ASC
    `);

    res.json({
      ok: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({
      ok: false,
      error: 'Error al obtener usuarios',
    });
  }
});

// Actualizar usuario - solo admin
router.put('/:id', authRequired, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { username, nombre_completo, rol, activo } = req.body;

    if (!username || !nombre_completo || !rol) {
      return res.status(400).json({
        ok: false,
        error: 'Username, nombre completo y rol son obligatorios',
      });
    }

    if (!['admin', 'usuario'].includes(rol)) {
      return res.status(400).json({
        ok: false,
        error: 'Rol no válido',
      });
    }

    const existe = await pool.query(
      `SELECT id FROM usuarios WHERE username = $1 AND id <> $2`,
      [username, id]
    );

    if (existe.rowCount > 0) {
      return res.status(409).json({
        ok: false,
        error: 'Ya existe otro usuario con ese username',
      });
    }

    const result = await pool.query(
      `UPDATE usuarios
       SET username = $1,
           nombre_completo = $2,
           rol = $3,
           activo = $4
       WHERE id = $5
       RETURNING id, username, nombre_completo, rol, activo`,
      [username, nombre_completo, rol, activo, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        ok: false,
        error: 'Usuario no encontrado',
      });
    }

    res.json({
      ok: true,
      message: 'Usuario actualizado correctamente',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({
      ok: false,
      error: 'Error al actualizar usuario',
    });
  }
});

// Cambiar contraseña - solo admin
router.put('/:id/password', authRequired, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        ok: false,
        error: 'La contraseña es obligatoria',
      });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `UPDATE usuarios
       SET password_hash = $1
       WHERE id = $2
       RETURNING id`,
      [password_hash, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        ok: false,
        error: 'Usuario no encontrado',
      });
    }

    res.json({
      ok: true,
      message: 'Contraseña actualizada correctamente',
    });
  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    res.status(500).json({
      ok: false,
      error: 'Error al cambiar contraseña',
    });
  }
});

export default router;