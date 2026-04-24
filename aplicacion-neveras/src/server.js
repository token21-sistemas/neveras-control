import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.routes.js';
import reportesRoutes from './routes/reportes.routes.js';
import equiposFrioRoutes from './routes/equiposFrio.routes.js';
import ubicacionesRoutes from './routes/ubicaciones.routes.js';
import usuariosRoutes from './routes/usuarios.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Fix __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 📦 RUTA ABSOLUTA AL FRONTEND (IMPORTANTE)
const frontendPath = path.join(__dirname, '../../frontend-neveras/dist');

// Middlewares
app.use(cors());
app.use(express.json());

/* =========================
   🔌 API
========================= */
app.use('/api/auth', authRoutes);
app.use('/api/reportes', reportesRoutes);
app.use('/api/equipos-frio', equiposFrioRoutes);
app.use('/api/ubicaciones', ubicacionesRoutes);
app.use('/api/usuarios', usuariosRoutes);

// Test API
app.get('/api', (req, res) => {
  res.json({
    ok: true,
    mensaje: 'API Control de Neveras funcionando',
  });
});

/* =========================
   🌐 FRONTEND (React)
========================= */

// Servir archivos estáticos
app.use(express.static(frontendPath));

// SPA fallback (MUY IMPORTANTE)
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

/* =========================
   ❌ ERRORES
========================= */
app.use((err, req, res, next) => {
  console.error('ERROR NO CONTROLADO:', err);

  res.status(500).json({
    ok: false,
    error: 'Error interno del servidor',
    detail: err.message,
  });
});

/* =========================
   🚀 START
========================= */
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});