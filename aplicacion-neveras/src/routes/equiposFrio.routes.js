import express from 'express';
import { pool } from '../db.js';
import { authRequired } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/role.middleware.js';

const router = express.Router();

// Obtener todos los equipos de frío
// Permitido para cualquier usuario autenticado
router.get('/', authRequired, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        ef.*,
        u.nombre AS ubicacion_nombre,
        u.tipo AS ubicacion_tipo
      FROM equipos_frio ef
      LEFT JOIN ubicaciones u ON u.id = ef.ubicacion_id
      ORDER BY ef.created_at DESC
    `);

    res.json({
      ok: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error al obtener equipos de frío:', error);
    res.status(500).json({
      ok: false,
      error: 'Error al obtener equipos de frío',
    });
  }
});

// Obtener un equipo por ID
// Permitido para cualquier usuario autenticado
router.get('/:id', authRequired, async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT
        ef.*,
        u.nombre AS ubicacion_nombre,
        u.tipo AS ubicacion_tipo
      FROM equipos_frio ef
      LEFT JOIN ubicaciones u ON u.id = ef.ubicacion_id
      WHERE ef.id = $1
      `,
      [req.params.id]
    );

    if (!result.rows.length) {
      return res.status(404).json({
        ok: false,
        error: 'Equipo no encontrado',
      });
    }

    res.json({
      ok: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error al obtener equipo:', error);
    res.status(500).json({
      ok: false,
      error: 'Error al obtener equipo',
    });
  }
});

// Crear equipo de frío
// Solo admin
router.post('/', authRequired, requireAdmin, async (req, res) => {
  try {
    const {
      ubicacion_id,
      codigo_equipo,
      descripcion,
      tipo_equipo,
      rango_min_temp,
      rango_max_temp,
      nombre,
      ubicacion,
      codigo_barras,
      marca,
      modelo,
      numero_serie,
      activo = true,
    } = req.body;

    if (!nombre) {
      return res.status(400).json({
        ok: false,
        error: 'El campo nombre es obligatorio',
      });
    }

    const result = await pool.query(
      `
      INSERT INTO equipos_frio
      (
        ubicacion_id,
        codigo_equipo,
        descripcion,
        tipo_equipo,
        rango_min_temp,
        rango_max_temp,
        nombre,
        ubicacion,
        codigo_barras,
        marca,
        modelo,
        numero_serie,
        activo
      )
      VALUES
      ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
      RETURNING *
      `,
      [
        ubicacion_id || null,
        codigo_equipo || null,
        descripcion || null,
        tipo_equipo || null,
        rango_min_temp ?? null,
        rango_max_temp ?? null,
        nombre || null,
        ubicacion || null,
        codigo_barras || null,
        marca || null,
        modelo || null,
        numero_serie || null,
        activo,
      ]
    );

    res.status(201).json({
      ok: true,
      message: 'Equipo de frío creado correctamente',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error al crear equipo de frío:', error);
    res.status(500).json({
      ok: false,
      error: 'Error al crear equipo de frío',
    });
  }
});

// Actualizar equipo de frío
// Solo admin
router.put('/:id', authRequired, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      ubicacion_id,
      codigo_equipo,
      descripcion,
      tipo_equipo,
      rango_min_temp,
      rango_max_temp,
      nombre,
      ubicacion,
      codigo_barras,
      marca,
      modelo,
      numero_serie,
      activo,
    } = req.body;

    if (!nombre) {
      return res.status(400).json({
        ok: false,
        error: 'El campo nombre es obligatorio',
      });
    }

    const result = await pool.query(
      `
      UPDATE equipos_frio
      SET
        ubicacion_id = $1,
        codigo_equipo = $2,
        descripcion = $3,
        tipo_equipo = $4,
        rango_min_temp = $5,
        rango_max_temp = $6,
        nombre = $7,
        ubicacion = $8,
        codigo_barras = $9,
        marca = $10,
        modelo = $11,
        numero_serie = $12,
        activo = $13,
        updated_at = NOW()
      WHERE id = $14
      RETURNING *
      `,
      [
        ubicacion_id || null,
        codigo_equipo || null,
        descripcion || null,
        tipo_equipo || null,
        rango_min_temp ?? null,
        rango_max_temp ?? null,
        nombre || null,
        ubicacion || null,
        codigo_barras || null,
        marca || null,
        modelo || null,
        numero_serie || null,
        activo,
        id,
      ]
    );

    if (!result.rows.length) {
      return res.status(404).json({
        ok: false,
        error: 'Equipo no encontrado',
      });
    }

    res.json({
      ok: true,
      message: 'Equipo de frío actualizado correctamente',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error al actualizar equipo de frío:', error);
    res.status(500).json({
      ok: false,
      error: 'Error al actualizar equipo de frío',
    });
  }
});

// Desactivar equipo
// Solo admin
router.delete('/:id', authRequired, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `
      UPDATE equipos_frio
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
        error: 'Equipo no encontrado',
      });
    }

    res.json({
      ok: true,
      message: 'Equipo desactivado correctamente',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error al desactivar equipo:', error);
    res.status(500).json({
      ok: false,
      error: 'Error al desactivar equipo',
    });
  }
});

export default router;