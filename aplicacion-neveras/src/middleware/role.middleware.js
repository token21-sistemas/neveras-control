export function requireAdmin(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({
        ok: false,
        error: 'Usuario no autenticado',
      });
    }

    if (req.user.rol !== 'admin') {
      return res.status(403).json({
        ok: false,
        error: 'No tienes permisos para esta acción',
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: 'Error comprobando permisos',
    });
  }
}