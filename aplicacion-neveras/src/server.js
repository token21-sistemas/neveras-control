import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.routes.js';
import reportesRoutes from './routes/reportes.routes.js';
import equiposFrioRoutes from './routes/equiposFrio.routes.js';
import ubicacionesRoutes from './routes/ubicaciones.routes.js';
import usuariosRoutes from './routes/usuarios.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares globales
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({
    ok: true,
    mensaje: 'API Control de Neveras funcionando',
  });
});

// Rutas API
app.use('/api/auth', authRoutes);
app.use('/api/reportes', reportesRoutes);
app.use('/api/equipos-frio', equiposFrioRoutes);
app.use('/api/ubicaciones', ubicacionesRoutes);
app.use('/api/usuarios', usuariosRoutes);

// Middleware de errores
app.use((err, req, res, next) => {
  console.error('ERROR NO CONTROLADO:', err);

  res.status(500).json({
    ok: false,
    error: 'Error interno del servidor',
    detail: err.message,
  });
});

// Arranque servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});