import jwt from 'jsonwebtoken';

export function authRequired(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        ok: false,
        error: 'Token no proporcionado',
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: decoded.id,
      username: decoded.username,
      rol: decoded.rol,
      nombre_completo: decoded.nombre_completo,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      ok: false,
      error: 'Token inválido o expirado',
      detail: error.message,
    });
  }
}