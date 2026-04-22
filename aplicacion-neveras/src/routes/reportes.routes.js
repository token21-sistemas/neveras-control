import express from 'express';
import PDFDocument from 'pdfkit';
import nodemailer from 'nodemailer';
import { pool } from '../db.js';
import { authRequired } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/role.middleware.js';

const router = express.Router();

// Todas las rutas de reportes requieren login
router.use(authRequired);

const buildReportesQuery = () => `
  SELECT
    r.id,
    r.fecha,
    r.hora,
    r.temperatura_declarada,
    r.estado,
    r.observaciones,
    r.puerta_ok,
    r.equipo_ok,
    r.limpieza_ok,
    r.firmado,
    COALESCE(u.nombre, 'Sin ubicación') AS vehiculo,
    u.tipo AS ubicacion_tipo,
    u.matricula AS ubicacion_matricula,
    ef.nombre AS equipo,
    ef.codigo_equipo,
    us.username,
    us.nombre_completo
  FROM reportes_diarios r
  LEFT JOIN ubicaciones u ON u.id = r.ubicacion_id
  LEFT JOIN equipos_frio ef ON ef.id = r.equipo_frio_id
  LEFT JOIN usuarios us ON us.id = r.usuario_id
  WHERE r.fecha BETWEEN $1 AND $2
  ORDER BY r.fecha DESC, r.hora DESC, r.id DESC
`;

const normalizarFechaISO = (valor) => {
  if (!valor) return '';
  const date = new Date(valor);
  if (Number.isNaN(date.getTime())) return String(valor).slice(0, 10);
  return date.toISOString().slice(0, 10);
};

const generarPdfReportesBuffer = ({ fechaDesde, fechaHasta, reportes, generadoPor }) =>
  new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margin: 40,
      });

      const chunks = [];
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      const total = reportes.length;
      const correctos = reportes.filter((r) => r.estado === 'correcto').length;
      const alertas = reportes.filter((r) => r.estado === 'alerta').length;
      const incidencias = reportes.filter((r) => r.estado === 'incidencia').length;

      doc.fontSize(18).text('Reporte de temperaturas', { align: 'center' });
      doc.moveDown(0.5);
      doc.fontSize(11).text(`Rango: ${fechaDesde} a ${fechaHasta}`);
      doc.text(`Generado por: ${generadoPor || 'Sistema'}`);
      doc.text(`Fecha de generación: ${new Date().toLocaleString('es-ES')}`);

      doc.moveDown();
      doc.fontSize(12).text(`Total reportes: ${total}`);
      doc.text(`Correctos: ${correctos} | Alertas: ${alertas} | Incidencias: ${incidencias}`);

      doc.moveDown();
      doc.fontSize(10);

      if (reportes.length === 0) {
        doc.text('No hay reportes en el rango seleccionado.');
        doc.end();
        return;
      }

      for (const reporte of reportes) {
        const linea1 = `${normalizarFechaISO(reporte.fecha)} ${reporte.hora || '-'}  |  ${reporte.vehiculo || '-'}  |  ${reporte.equipo || '-'}`;
        const linea2 = `Temp: ${reporte.temperatura_declarada ?? '-'} ºC  |  Estado: ${reporte.estado || '-'}  |  Usuario: ${reporte.username || reporte.nombre_completo || '-'}`;
        const linea3 = `Obs: ${reporte.observaciones || '-'}`;

        if (doc.y > 720) {
          doc.addPage();
        }

        doc.font('Helvetica-Bold').text(linea1);
        doc.font('Helvetica').text(linea2);
        doc.text(linea3);
        doc.moveDown(0.8);

        doc
          .moveTo(40, doc.y)
          .lineTo(555, doc.y)
          .strokeColor('#cccccc')
          .stroke();

        doc.moveDown(0.8);
      }

      doc.end();
    } catch (error) {
      reject(error);
    }
  });

const getMailTransporter = () => {
  if (!process.env.MAIL_HOST || !process.env.MAIL_USER || !process.env.MAIL_PASS) {
    throw new Error('Falta configuración de correo en el archivo .env');
  }

  return nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT || 587),
    secure: String(process.env.MAIL_SECURE || 'false') === 'true',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });
};

// Catálogos
router.get('/catalogos', async (req, res) => {
  try {
    const ubicacionesResult = await pool.query(`
      SELECT
        id,
        nombre,
        matricula,
        tipo,
        codigo
      FROM ubicaciones
      WHERE activo = true
      ORDER BY nombre ASC
    `);

    const equiposResult = await pool.query(`
      SELECT
        ef.*,
        u.nombre AS ubicacion_nombre,
        u.tipo AS ubicacion_tipo,
        u.matricula AS ubicacion_matricula
      FROM equipos_frio ef
      LEFT JOIN ubicaciones u ON u.id = ef.ubicacion_id
      WHERE ef.activo = true
      ORDER BY ef.nombre ASC, ef.codigo_equipo ASC
    `);

    res.json({
      ok: true,
      vehiculos: ubicacionesResult.rows,
      equipos: equiposResult.rows,
    });
  } catch (error) {
    console.error('Error al cargar catálogos:', error);
    res.status(500).json({
      ok: false,
      error: 'Error al cargar catálogos',
      detail: error.message,
    });
  }
});

// Reportes de hoy
router.get('/hoy', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        r.id,
        r.fecha,
        r.hora,
        r.temperatura_declarada,
        r.estado,
        r.observaciones,
        COALESCE(u.nombre, 'Sin ubicación') AS vehiculo,
        ef.nombre AS equipo,
        ef.codigo_equipo,
        us.username
      FROM reportes_diarios r
      LEFT JOIN ubicaciones u ON u.id = r.ubicacion_id
      LEFT JOIN equipos_frio ef ON ef.id = r.equipo_frio_id
      LEFT JOIN usuarios us ON us.id = r.usuario_id
      WHERE r.fecha = CURRENT_DATE
      ORDER BY r.hora DESC, r.id DESC
    `);

    res.json({
      ok: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error al cargar reportes de hoy:', error);
    res.status(500).json({
      ok: false,
      error: 'Error al cargar reportes de hoy',
      detail: error.message,
    });
  }
});

// Reportes por rango
router.get('/rango', requireAdmin, async (req, res) => {
  try {
    const { fecha_desde, fecha_hasta } = req.query;

    if (!fecha_desde || !fecha_hasta) {
      return res.status(400).json({
        ok: false,
        error: 'Fecha desde y fecha hasta son obligatorias',
      });
    }

    const result = await pool.query(buildReportesQuery(), [fecha_desde, fecha_hasta]);

    res.json({
      ok: true,
      data: result.rows,
      resumen: {
        total: result.rows.length,
        correctos: result.rows.filter((r) => r.estado === 'correcto').length,
        alertas: result.rows.filter((r) => r.estado === 'alerta').length,
        incidencias: result.rows.filter((r) => r.estado === 'incidencia').length,
      },
    });
  } catch (error) {
    console.error('Error al cargar reportes por rango:', error);
    res.status(500).json({
      ok: false,
      error: 'Error al cargar reportes por rango',
      detail: error.message,
    });
  }
});

// Descargar PDF de reportes por rango
router.get('/pdf', requireAdmin, async (req, res) => {
  try {
    const { fecha_desde, fecha_hasta } = req.query;

    if (!fecha_desde || !fecha_hasta) {
      return res.status(400).json({
        ok: false,
        error: 'Fecha desde y fecha hasta son obligatorias',
      });
    }

    const result = await pool.query(buildReportesQuery(), [fecha_desde, fecha_hasta]);

    const pdfBuffer = await generarPdfReportesBuffer({
      fechaDesde: fecha_desde,
      fechaHasta: fecha_hasta,
      reportes: result.rows,
      generadoPor: req.user?.username || req.user?.nombre_completo || 'Admin',
    });

    const fileName = `reportes_${fecha_desde}_a_${fecha_hasta}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    return res.send(pdfBuffer);
  } catch (error) {
    console.error('Error al generar PDF de reportes:', error);
    res.status(500).json({
      ok: false,
      error: 'Error al generar PDF de reportes',
      detail: error.message,
    });
  }
});

// Enviar PDF por email
router.post('/enviar-pdf', requireAdmin, async (req, res) => {
  try {
    const { fecha_desde, fecha_hasta, destinatarios, asunto, mensaje } = req.body;

    if (!fecha_desde || !fecha_hasta) {
      return res.status(400).json({
        ok: false,
        error: 'Fecha desde y fecha hasta son obligatorias',
      });
    }

    if (!destinatarios || !Array.isArray(destinatarios) || destinatarios.length === 0) {
      return res.status(400).json({
        ok: false,
        error: 'Debes indicar al menos un destinatario',
      });
    }

    const result = await pool.query(buildReportesQuery(), [fecha_desde, fecha_hasta]);

    const pdfBuffer = await generarPdfReportesBuffer({
      fechaDesde: fecha_desde,
      fechaHasta: fecha_hasta,
      reportes: result.rows,
      generadoPor: req.user?.username || req.user?.nombre_completo || 'Admin',
    });

    const transporter = getMailTransporter();

    const asuntoFinal =
      asunto || `Reporte de temperaturas del ${fecha_desde} al ${fecha_hasta}`;

    const mensajeFinal =
      mensaje ||
      `Adjunto se envía el reporte de temperaturas del periodo ${fecha_desde} a ${fecha_hasta}.`;

    await transporter.sendMail({
      from: process.env.MAIL_FROM || process.env.MAIL_USER,
      to: destinatarios.join(','),
      subject: asuntoFinal,
      text: mensajeFinal,
      attachments: [
        {
          filename: `reportes_${fecha_desde}_a_${fecha_hasta}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    });

    res.json({
      ok: true,
      message: 'PDF enviado por email correctamente',
    });
  } catch (error) {
    console.error('Error al enviar PDF por email:', error);
    res.status(500).json({
      ok: false,
      error: 'Error al enviar PDF por email',
      detail: error.message,
    });
  }
});

// Crear reporte
router.post('/', async (req, res) => {
  try {
    const {
      vehiculo_id,
      ubicacion_id,
      equipo_frio_id,
      fecha,
      hora,
      temperatura_declarada,
      estado,
      puerta_ok,
      equipo_ok,
      limpieza_ok,
      observaciones,
      firmado,
    } = req.body;

    const ubicacionIdFinal = ubicacion_id || vehiculo_id;

    if (!ubicacionIdFinal || !equipo_frio_id || !fecha || !hora) {
      return res.status(400).json({
        ok: false,
        error: 'Faltan campos obligatorios',
      });
    }

    if (
      temperatura_declarada === undefined ||
      temperatura_declarada === null ||
      temperatura_declarada === ''
    ) {
      return res.status(400).json({
        ok: false,
        error: 'La temperatura es obligatoria',
      });
    }

    if (!estado) {
      return res.status(400).json({
        ok: false,
        error: 'El estado es obligatorio',
      });
    }

    const usuario_id = req.user.id;

    const result = await pool.query(
      `
      INSERT INTO reportes_diarios (
        vehiculo_id,
        ubicacion_id,
        equipo_frio_id,
        usuario_id,
        fecha,
        hora,
        temperatura_declarada,
        estado,
        puerta_ok,
        equipo_ok,
        limpieza_ok,
        observaciones,
        firmado
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13
      )
      RETURNING *
      `,
      [
        null,
        Number(ubicacionIdFinal),
        Number(equipo_frio_id),
        Number(usuario_id),
        fecha,
        hora,
        Number(temperatura_declarada),
        estado,
        Boolean(puerta_ok),
        Boolean(equipo_ok),
        Boolean(limpieza_ok),
        observaciones || '',
        Boolean(firmado),
      ]
    );

    res.status(201).json({
      ok: true,
      message: 'Reporte guardado correctamente',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error al guardar reporte:', error);
    res.status(500).json({
      ok: false,
      error: 'Error guardando reporte',
      detail: error.message,
    });
  }
});

export default router;