import express from 'express';
import { pool } from '../db.js';
import { authRequired } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/role.middleware.js';

const router = express.Router();

// Obtener todas las ubicaciones
// Permitido para cualquier usuario autenticado
router.get('/', authRequired, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM ubicaciones
      ORDER BY nombre ASC
    `);

    res.json({
      ok: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error al obtener ubicaciones:', error);
    res.status(500).json({
      ok: false,
      error: 'Error al obtener ubicaciones',
    });
  }
});

// Obtener una ubicación por ID
// Permitido para cualquier usuario autenticado
router.get('/:id', authRequired, async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT *
      FROM ubicaciones
      WHERE id = $1
      `,
      [req.params.id]
    );

    if (!result.rows.length) {
      return res.status(404).json({
        ok: false,
        error: 'Ubicación no encontrada',
      });
    }

    res.json({
      ok: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error al obtener ubicación:', error);
    res.status(500).json({
      ok: false,
      error: 'Error al obtener ubicación',
    });
  }
});

// Crear ubicación
// Solo admin
router.post('/', authRequired, requireAdmin, async (req, res) => {
  try {
    const {
      tipo,
      codigo,
      nombre,
      matricula,
      marca,
      modelo,
      direccion,
      ciudad,
      activo = true,
    } = req.body;

    if (!tipo || !nombre) {
      return res.status(400).json({
        ok: false,
        error: 'Los campos tipo y nombre son obligatorios',
      });
    }

    const result = await pool.query(
      `
      INSERT INTO ubicaciones
      (tipo, codigo, nombre, matricula, marca, modelo, direccion, ciudad, activo)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
      `,
      [tipo, codigo, nombre, matricula, marca, modelo, direccion, ciudad, activo]
    );

    res.status(201).json({
      ok: true,
      message: 'Ubicación creada correctamente',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error al crear ubicación:', error);
    res.status(500).json({
      ok: false,
      error: 'Error al crear ubicación',
    });
  }
});

// Actualizar ubicación
// Solo admin
router.put('/:id', authRequired, requireAdmin, async (req, res) => {
  try {
    const {
      tipo,
      codigo,
      nombre,
      matricula,
      marca,
      modelo,
      direccion,
      ciudad,
      activo,
    } = req.body;

    if (!tipo || !nombre) {
      return res.status(400).json({
        ok: false,
        error: 'Los campos tipo y nombre son obligatorios',
      });
    }

    const result = await pool.query(
      `
      UPDATE ubicaciones
      SET tipo = $1,
          codigo = $2,
          nombre = $3,
          matricula = $4,
          marca = $5,
          modelo = $6,
          direccion = $7,
          ciudad = $8,
          activo = $9,
          updated_at = NOW()
      WHERE id = $10
      RETURNING *
      `,
      [
        tipo,
        codigo,
        nombre,
        matricula,
        marca,
        modelo,
        direccion,
        ciudad,
        activo,
        req.params.id,
      ]
    );

    if (!result.rows.length) {
      return res.status(404).json({
        ok: false,
        error: 'Ubicación no encontrada',
      });
    }

    res.json({
      ok: true,
      message: 'Ubicación actualizada correctamente',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error al actualizar ubicación:', error);
    res.status(500).json({
      ok: false,
      error: 'Error al actualizar ubicación',
    });
  }
});

// Desactivar ubicación
// Solo admin
router.delete('/:id', authRequired, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `
      UPDATE ubicaciones
      SET activo = false,
          updated_at = NOW()
      WHERE id = $1
      RETURNING *
      `,
      [req.params.id]
    );

    if (!result.rows.length) {
      return res.status(404).json({
        ok: false,
        error: 'Ubicación no encontrada',
      });
    }

    res.json({
      ok: true,
      message: 'Ubicación desactivada correctamente',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error al desactivar ubicación:', error);
    res.status(500).json({
      ok: false,
      error: 'Error al desactivar ubicación',
    });
  }
});

export default router;