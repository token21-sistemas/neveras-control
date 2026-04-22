import React, { useEffect, useMemo, useRef, useState } from 'react';

const API_URL = '/api';

const styles = {
  page: {
    minHeight: '100vh',
    background: '#f3f6fb',
    padding: '32px 20px',
    fontFamily: 'Arial, sans-serif',
    color: '#1f2937',
  },
  wrapper: {
    maxWidth: 1300,
    margin: '0 auto',
  },
  headerCard: {
    background: '#ffffff',
    borderRadius: 20,
    boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)',
    padding: 24,
    marginBottom: 24,
    border: '1px solid #e5e7eb',
  },
  title: {
    margin: 0,
    fontSize: 32,
    fontWeight: 700,
    color: '#0f172a',
  },
  subtitle: {
    margin: '8px 0 0 0',
    color: '#64748b',
    fontSize: 16,
  },
  grid2: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 24,
  },
  loginGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: 24,
    maxWidth: 700,
    margin: '0 auto',
  },
  card: {
    background: '#ffffff',
    borderRadius: 20,
    boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)',
    padding: 24,
    border: '1px solid #e5e7eb',
  },
  cardTitle: {
    margin: '0 0 16px 0',
    fontSize: 24,
    fontWeight: 700,
    color: '#0f172a',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  },
  row2: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 12,
  },
  row3: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: 12,
  },
  label: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    fontSize: 14,
    color: '#475569',
    fontWeight: 600,
  },
  input: {
    height: 46,
    borderRadius: 12,
    border: '1px solid #cbd5e1',
    padding: '0 12px',
    fontSize: 15,
    background: '#fff',
  },
  select: {
    height: 46,
    borderRadius: 12,
    border: '1px solid #cbd5e1',
    padding: '0 12px',
    fontSize: 15,
    background: '#fff',
  },
  textarea: {
    minHeight: 90,
    borderRadius: 12,
    border: '1px solid #cbd5e1',
    padding: 12,
    fontSize: 15,
    background: '#fff',
    resize: 'vertical',
  },
  button: {
    height: 46,
    borderRadius: 12,
    border: 'none',
    background: '#0f172a',
    color: '#fff',
    fontWeight: 700,
    fontSize: 15,
    cursor: 'pointer',
    padding: '0 18px',
  },
  buttonSecondary: {
    height: 42,
    borderRadius: 12,
    border: '1px solid #cbd5e1',
    background: '#fff',
    color: '#334155',
    fontWeight: 600,
    fontSize: 14,
    cursor: 'pointer',
    padding: '0 16px',
  },
  buttonDanger: {
    height: 36,
    borderRadius: 10,
    border: '1px solid #fca5a5',
    background: '#fff',
    color: '#b91c1c',
    fontWeight: 700,
    fontSize: 13,
    cursor: 'pointer',
    padding: '0 12px',
  },
  buttonEdit: {
    height: 36,
    borderRadius: 10,
    border: '1px solid #93c5fd',
    background: '#fff',
    color: '#1d4ed8',
    fontWeight: 700,
    fontSize: 13,
    cursor: 'pointer',
    padding: '0 12px',
  },
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  success: {
    background: '#dcfce7',
    color: '#166534',
    border: '1px solid #86efac',
    borderRadius: 14,
    padding: '12px 16px',
    marginBottom: 16,
    fontWeight: 600,
  },
  error: {
    background: '#fee2e2',
    color: '#991b1b',
    border: '1px solid #fca5a5',
    borderRadius: 14,
    padding: '12px 16px',
    marginBottom: 16,
    fontWeight: 600,
  },
  checkboxGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 10,
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 14,
    color: '#334155',
    fontWeight: 600,
  },
  tableWrap: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: 14,
  },
  th: {
    textAlign: 'left',
    padding: '12px 10px',
    borderBottom: '1px solid #cbd5e1',
    color: '#64748b',
    fontSize: 13,
    whiteSpace: 'nowrap',
  },
  td: {
    padding: '12px 10px',
    borderBottom: '1px solid #e5e7eb',
    color: '#334155',
    verticalAlign: 'top',
  },
  badge: {
    display: 'inline-block',
    padding: '6px 10px',
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 700,
  },
  scanBox: {
    background: '#eff6ff',
    border: '1px solid #bfdbfe',
    borderRadius: 16,
    padding: 16,
    marginBottom: 18,
  },
  scanTitle: {
    margin: '0 0 10px 0',
    fontSize: 18,
    fontWeight: 700,
    color: '#1e3a8a',
  },
  scanHelp: {
    margin: '0 0 12px 0',
    color: '#475569',
    fontSize: 14,
  },
  scanInput: {
    height: 52,
    borderRadius: 12,
    border: '2px solid #93c5fd',
    padding: '0 14px',
    fontSize: 20,
    background: '#fff',
    width: '100%',
    boxSizing: 'border-box',
  },
  scanResult: {
    marginTop: 12,
    padding: '10px 12px',
    borderRadius: 12,
    background: '#ffffff',
    border: '1px solid #dbeafe',
    color: '#334155',
    fontWeight: 600,
  },
  navTabs: {
    display: 'flex',
    gap: 10,
    flexWrap: 'wrap',
    marginTop: 18,
  },
  navButton: {
    height: 42,
    borderRadius: 12,
    border: '1px solid #cbd5e1',
    background: '#fff',
    color: '#334155',
    fontWeight: 700,
    fontSize: 14,
    cursor: 'pointer',
    padding: '0 16px',
  },
  navButtonActive: {
    height: 42,
    borderRadius: 12,
    border: '1px solid #0f172a',
    background: '#0f172a',
    color: '#fff',
    fontWeight: 700,
    fontSize: 14,
    cursor: 'pointer',
    padding: '0 16px',
  },
  actionsCell: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
  },
};

function estadoStyle(estado) {
  if (estado === 'correcto' || estado === 'activa' || estado === 'activo') {
    return { ...styles.badge, background: '#dcfce7', color: '#166534' };
  }
  if (estado === 'alerta') {
    return { ...styles.badge, background: '#fef3c7', color: '#92400e' };
  }
  return { ...styles.badge, background: '#fee2e2', color: '#991b1b' };
}

function formatearUbicacion(u) {
  const nombre = u?.nombre || 'Sin nombre';
  const tipo = u?.tipo ? `(${u.tipo})` : '';
  const extra = u?.matricula ? ` - ${u.matricula}` : '';
  return `${nombre} ${tipo}${extra}`.trim();
}

const getHoraActual = () => {
  const now = new Date();
  const horas = String(now.getHours()).padStart(2, '0');
  const minutos = String(now.getMinutes()).padStart(2, '0');
  const segundos = String(now.getSeconds()).padStart(2, '0');
  return `${horas}:${minutos}:${segundos}`;
};

const getDefaultUbicacionForm = () => ({
  tipo: 'vehiculo',
  codigo: '',
  nombre: '',
  matricula: '',
  marca: '',
  modelo: '',
  direccion: '',
  ciudad: '',
  activo: true,
});

const getDefaultEquipoForm = () => ({
  ubicacion_id: '',
  codigo_equipo: '',
  nombre: '',
  descripcion: '',
  tipo_equipo: 'refrigerado',
  rango_min_temp: '',
  rango_max_temp: '',
  ubicacion: '',
  codigo_barras: '',
  marca: '',
  modelo: '',
  numero_serie: '',
  activo: true,
});

const getDefaultUsuarioForm = () => ({
  username: '',
  nombre_completo: '',
  password: '',
  rol: 'usuario',
  activo: true,
});

export default function App() {
  const [vista, setVista] = useState('reportes');
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const [loginData, setLoginData] = useState({
    username: 'admin',
    password: 'Admin1234',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [reportes, setReportes] = useState([]);
  const [ubicaciones, setUbicaciones] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [barcode, setBarcode] = useState('');
  const [scannerMessage, setScannerMessage] = useState('');
  const barcodeInputRef = useRef(null);

  const [editandoUbicacionId, setEditandoUbicacionId] = useState(null);
  const [editandoEquipoId, setEditandoEquipoId] = useState(null);
  const [editandoUsuarioId, setEditandoUsuarioId] = useState(null);

  const [form, setForm] = useState({
    vehiculo_id: '',
    equipo_frio_id: '',
    fecha: new Date().toISOString().slice(0, 10),
    hora: getHoraActual(),
    temperatura_declarada: '4.5',
    estado: 'correcto',
    puerta_ok: true,
    equipo_ok: true,
    limpieza_ok: true,
    observaciones: '',
    firmado: true,
  });

  const [ubicacionForm, setUbicacionForm] = useState(getDefaultUbicacionForm());
  const [equipoForm, setEquipoForm] = useState(getDefaultEquipoForm());
  const [usuarioForm, setUsuarioForm] = useState(getDefaultUsuarioForm());

  const [reporteMailForm, setReporteMailForm] = useState({
    fecha_desde: new Date().toISOString().slice(0, 10),
    fecha_hasta: new Date().toISOString().slice(0, 10),
    destinatarios: 'info@token.es',
    asunto: '',
    mensaje: '',
  });

  const isLogged = useMemo(() => Boolean(token), [token]);
  const isAdmin = useMemo(() => user?.rol === 'admin', [user]);

  const equiposFiltrados = useMemo(() => {
    if (!form.vehiculo_id) return equipos;
    return equipos.filter(
      (e) => String(e.ubicacion_id || '') === String(form.vehiculo_id)
    );
  }, [equipos, form.vehiculo_id]);

  const authHeaders = (customToken) => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${customToken || token}`,
  });

  useEffect(() => {
    if (isLogged) {
      cargarTodoInicial();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'vehiculo_id') {
      setForm((prev) => ({
        ...prev,
        vehiculo_id: value,
        equipo_frio_id: '',
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleUbicacionFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUbicacionForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleEquipoFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEquipoForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleUsuarioFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUsuarioForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleReporteMailFormChange = (e) => {
    const { name, value } = e.target;
    setReporteMailForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const buscarEquipoPorCodigo = (codigoLeido) => {
    const limpio = String(codigoLeido || '').trim();
    if (!limpio) return null;

    return (
      equipos.find((e) => String(e.codigo_barras || '').trim() === limpio) ||
      equipos.find((e) => String(e.codigo_equipo || '').trim() === limpio) ||
      null
    );
  };

  const procesarCodigo = (codigoLeido) => {
    const equipo = buscarEquipoPorCodigo(codigoLeido);

    if (!equipo) {
      setScannerMessage(`Código no registrado: ${codigoLeido}`);
      return;
    }

    setForm((prev) => ({
      ...prev,
      vehiculo_id: equipo.ubicacion_id ? String(equipo.ubicacion_id) : prev.vehiculo_id,
      equipo_frio_id: String(equipo.id),
    }));

    setScannerMessage(
      `Nevera detectada: ${equipo.nombre || equipo.codigo_equipo}${
        equipo.ubicacion_nombre ? ` · ${equipo.ubicacion_nombre}` : ''
      }`
    );
  };

  const handleBarcodeKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const codigo = barcode.trim();
      if (!codigo) return;
      procesarCodigo(codigo);
      setBarcode('');
    }
  };

  const normalizarListado = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.data)) return data.data;
    return [];
  };

  const cargarUbicaciones = async (customToken) => {
    const response = await fetch(`${API_URL}/ubicaciones`, {
      headers: authHeaders(customToken),
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Error cargando ubicaciones');
    }

    const ubicacionesArray = normalizarListado(data);
    setUbicaciones(ubicacionesArray);

    setEquipoForm((prev) => ({
      ...prev,
      ubicacion_id:
        prev.ubicacion_id || (ubicacionesArray.length > 0 ? String(ubicacionesArray[0].id) : ''),
    }));

    return ubicacionesArray;
  };

  const cargarEquipos = async (customToken) => {
    const response = await fetch(`${API_URL}/equipos-frio`, {
      headers: authHeaders(customToken),
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Error cargando equipos');
    }

    const equiposArray = normalizarListado(data);
    setEquipos(equiposArray);
    return equiposArray;
  };

  const cargarUsuarios = async (customToken) => {
    const response = await fetch(`${API_URL}/usuarios`, {
      headers: authHeaders(customToken),
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Error cargando usuarios');
    }

    const usuariosArray = normalizarListado(data);
    setUsuarios(usuariosArray);
    return usuariosArray;
  };

  const cargarCatalogos = async (customToken) => {
    try {
      const [ubicacionesArray, equiposArray] = await Promise.all([
        cargarUbicaciones(customToken),
        cargarEquipos(customToken),
      ]);

      setForm((prev) => {
        const siguienteUbicacion =
          prev.vehiculo_id || (ubicacionesArray.length > 0 ? String(ubicacionesArray[0].id) : '');

        const equiposDeUbicacion = equiposArray.filter(
          (e) => String(e.ubicacion_id || '') === String(siguienteUbicacion)
        );

        const siguienteEquipo =
          prev.equipo_frio_id ||
          (equiposDeUbicacion.length > 0 ? String(equiposDeUbicacion[0].id) : '');

        return {
          ...prev,
          vehiculo_id: siguienteUbicacion,
          equipo_frio_id: siguienteEquipo,
        };
      });
    } catch (err) {
      setUbicaciones([]);
      setEquipos([]);
      setError(err.message);
    }
  };

  const cargarReportes = async (customToken) => {
    try {
      const response = await fetch(`${API_URL}/reportes/hoy`, {
        headers: authHeaders(customToken),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error cargando reportes');
      }

      setReportes(normalizarListado(data));
    } catch (err) {
      setReportes([]);
      setError(err.message);
    }
  };

  const cargarTodoInicial = async (customToken) => {
    setError('');
    try {
      const tareas = [
        cargarReportes(customToken),
        cargarCatalogos(customToken),
      ];

      if (isAdmin) {
        tareas.push(cargarUsuarios(customToken));
      }

      await Promise.all(tareas);

      setTimeout(() => {
        if (barcodeInputRef.current) {
          barcodeInputRef.current.focus();
        }
      }, 150);
    } catch (err) {
      setError(err.message);
    }
  };

  const login = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error en login');
      }

      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setSuccess('Login correcto');

      const tareas = [
        cargarReportes(data.token),
        cargarCatalogos(data.token),
      ];

      if (data.user?.rol === 'admin') {
        tareas.push(cargarUsuarios(data.token));
      }

      await Promise.all(tareas);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const guardarReporte = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        vehiculo_id: Number(form.vehiculo_id),
        equipo_frio_id: Number(form.equipo_frio_id),
        fecha: form.fecha,
        hora: form.hora,
        temperatura_declarada: Number(form.temperatura_declarada),
        estado: form.estado,
        puerta_ok: form.puerta_ok,
        equipo_ok: form.equipo_ok,
        limpieza_ok: form.limpieza_ok,
        observaciones: form.observaciones,
        firmado: form.firmado,
      };

      const response = await fetch(`${API_URL}/reportes`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error guardando reporte');
      }

      setSuccess('Reporte guardado correctamente');
      await cargarReportes();

      setForm((prev) => ({
        ...prev,
        fecha: new Date().toISOString().slice(0, 10),
        hora: getHoraActual(),
        equipo_frio_id:
          equiposFiltrados.length > 0 ? String(equiposFiltrados[0].id) : '',
        temperatura_declarada: '4.5',
        estado: 'correcto',
        puerta_ok: true,
        equipo_ok: true,
        limpieza_ok: true,
        observaciones: '',
        firmado: true,
      }));

      setBarcode('');
      setScannerMessage('');
      setVista('reportes');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const guardarUbicacion = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const metodo = editandoUbicacionId ? 'PUT' : 'POST';
      const url = editandoUbicacionId
        ? `${API_URL}/ubicaciones/${editandoUbicacionId}`
        : `${API_URL}/ubicaciones`;

      const response = await fetch(url, {
        method: metodo,
        headers: authHeaders(),
        body: JSON.stringify(ubicacionForm),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error guardando ubicación');
      }

      setSuccess(
        editandoUbicacionId
          ? 'Ubicación actualizada correctamente'
          : 'Ubicación guardada correctamente'
      );

      setUbicacionForm(getDefaultUbicacionForm());
      setEditandoUbicacionId(null);

      await cargarUbicaciones();
      await cargarCatalogos();
      setVista('ubicaciones');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const guardarEquipo = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        ubicacion_id: equipoForm.ubicacion_id ? Number(equipoForm.ubicacion_id) : null,
        codigo_equipo: equipoForm.codigo_equipo,
        descripcion: equipoForm.descripcion,
        tipo_equipo: equipoForm.tipo_equipo,
        rango_min_temp:
          equipoForm.rango_min_temp === '' ? null : Number(equipoForm.rango_min_temp),
        rango_max_temp:
          equipoForm.rango_max_temp === '' ? null : Number(equipoForm.rango_max_temp),
        nombre: equipoForm.nombre,
        ubicacion: equipoForm.ubicacion,
        codigo_barras: equipoForm.codigo_barras,
        marca: equipoForm.marca,
        modelo: equipoForm.modelo,
        numero_serie: equipoForm.numero_serie,
        activo: equipoForm.activo,
      };

      const metodo = editandoEquipoId ? 'PUT' : 'POST';
      const url = editandoEquipoId
        ? `${API_URL}/equipos-frio/${editandoEquipoId}`
        : `${API_URL}/equipos-frio`;

      const response = await fetch(url, {
        method: metodo,
        headers: authHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error guardando equipo');
      }

      setSuccess(
        editandoEquipoId
          ? 'Equipo actualizado correctamente'
          : 'Equipo guardado correctamente'
      );

      setEquipoForm((prev) => ({
        ...getDefaultEquipoForm(),
        ubicacion_id: prev.ubicacion_id || '',
      }));
      setEditandoEquipoId(null);

      await cargarEquipos();
      setVista('equipos');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const guardarUsuario = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (editandoUsuarioId) {
        const response = await fetch(`${API_URL}/usuarios/${editandoUsuarioId}`, {
          method: 'PUT',
          headers: authHeaders(),
          body: JSON.stringify({
            username: usuarioForm.username,
            nombre_completo: usuarioForm.nombre_completo,
            rol: usuarioForm.rol,
            activo: usuarioForm.activo,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Error actualizando usuario');
        }

        if (usuarioForm.password.trim()) {
          const responsePassword = await fetch(
            `${API_URL}/usuarios/${editandoUsuarioId}/password`,
            {
              method: 'PUT',
              headers: authHeaders(),
              body: JSON.stringify({
                password: usuarioForm.password,
              }),
            }
          );

          const dataPassword = await responsePassword.json();

          if (!responsePassword.ok) {
            throw new Error(dataPassword.error || 'Error actualizando contraseña');
          }
        }

        setSuccess('Usuario actualizado correctamente');
      } else {
        const response = await fetch(`${API_URL}/auth/register`, {
          method: 'POST',
          headers: authHeaders(),
          body: JSON.stringify(usuarioForm),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Error creando usuario');
        }

        setSuccess('Usuario creado correctamente');
      }

      setUsuarioForm(getDefaultUsuarioForm());
      setEditandoUsuarioId(null);
      await cargarUsuarios();
      setVista('usuarios');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const descargarPdfReportes = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const params = new URLSearchParams({
        fecha_desde: reporteMailForm.fecha_desde,
        fecha_hasta: reporteMailForm.fecha_hasta,
      });

      const response = await fetch(`${API_URL}/reportes/pdf?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        let errorMsg = 'Error generando PDF';
        try {
          const data = await response.json();
          errorMsg = data.detail || data.error || errorMsg;
        } catch {
          // ignore
        }
        throw new Error(errorMsg);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reportes_${reporteMailForm.fecha_desde}_a_${reporteMailForm.fecha_hasta}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      setSuccess('PDF generado correctamente');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const enviarPdfReportesPorEmail = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const destinatarios = reporteMailForm.destinatarios
        .split(',')
        .map((email) => email.trim())
        .filter(Boolean);

      if (destinatarios.length === 0) {
        throw new Error('Debes indicar al menos un destinatario');
      }

      const response = await fetch(`${API_URL}/reportes/enviar-pdf`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          fecha_desde: reporteMailForm.fecha_desde,
          fecha_hasta: reporteMailForm.fecha_hasta,
          destinatarios,
          asunto: reporteMailForm.asunto,
          mensaje: reporteMailForm.mensaje,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || data.error || 'Error enviando PDF por email');
      }

      setSuccess('PDF enviado por email correctamente');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const editarUbicacion = (u) => {
    setEditandoUbicacionId(u.id);
    setUbicacionForm({
      tipo: u.tipo || 'vehiculo',
      codigo: u.codigo || '',
      nombre: u.nombre || '',
      matricula: u.matricula || '',
      marca: u.marca || '',
      modelo: u.modelo || '',
      direccion: u.direccion || '',
      ciudad: u.ciudad || '',
      activo: Boolean(u.activo),
    });
    setVista('ubicaciones');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const editarEquipo = (e) => {
    setEditandoEquipoId(e.id);
    setEquipoForm({
      ubicacion_id: e.ubicacion_id ? String(e.ubicacion_id) : '',
      codigo_equipo: e.codigo_equipo || '',
      nombre: e.nombre || '',
      descripcion: e.descripcion || '',
      tipo_equipo: e.tipo_equipo || 'refrigerado',
      rango_min_temp:
        e.rango_min_temp === null || e.rango_min_temp === undefined ? '' : String(e.rango_min_temp),
      rango_max_temp:
        e.rango_max_temp === null || e.rango_max_temp === undefined ? '' : String(e.rango_max_temp),
      ubicacion: e.ubicacion || '',
      codigo_barras: e.codigo_barras || '',
      marca: e.marca || '',
      modelo: e.modelo || '',
      numero_serie: e.numero_serie || '',
      activo: Boolean(e.activo),
    });
    setVista('equipos');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const editarUsuario = (u) => {
    setEditandoUsuarioId(u.id);
    setUsuarioForm({
      username: u.username || '',
      nombre_completo: u.nombre_completo || '',
      password: '',
      rol: u.rol || 'usuario',
      activo: Boolean(u.activo),
    });
    setVista('usuarios');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const desactivarUbicacion = async (id) => {
    if (!window.confirm('¿Seguro que quieres desactivar esta ubicación?')) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${API_URL}/ubicaciones/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error desactivando ubicación');
      }

      setSuccess('Ubicación desactivada correctamente');
      await cargarUbicaciones();
      await cargarCatalogos();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const desactivarEquipo = async (id) => {
    if (!window.confirm('¿Seguro que quieres desactivar este equipo?')) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${API_URL}/equipos-frio/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error desactivando equipo');
      }

      setSuccess('Equipo desactivado correctamente');
      await cargarEquipos();
      await cargarCatalogos();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const cancelarEdicionUbicacion = () => {
    setEditandoUbicacionId(null);
    setUbicacionForm(getDefaultUbicacionForm());
  };

  const cancelarEdicionEquipo = () => {
    setEditandoEquipoId(null);
    setEquipoForm((prev) => ({
      ...getDefaultEquipoForm(),
      ubicacion_id: prev.ubicacion_id || '',
    }));
  };

  const cancelarEdicionUsuario = () => {
    setEditandoUsuarioId(null);
    setUsuarioForm(getDefaultUsuarioForm());
  };

  const salir = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    setVista('reportes');
    setToken('');
    setUser(null);
    setReportes([]);
    setUbicaciones([]);
    setEquipos([]);
    setUsuarios([]);
    setSuccess('');
    setError('');
    setBarcode('');
    setScannerMessage('');
    setEditandoUbicacionId(null);
    setEditandoEquipoId(null);
    setEditandoUsuarioId(null);
    setUbicacionForm(getDefaultUbicacionForm());
    setEquipoForm(getDefaultEquipoForm());
    setUsuarioForm(getDefaultUsuarioForm());
    setReporteMailForm({
      fecha_desde: new Date().toISOString().slice(0, 10),
      fecha_hasta: new Date().toISOString().slice(0, 10),
      destinatarios: 'info@token.es',
      asunto: '',
      mensaje: '',
    });
    setForm({
      vehiculo_id: '',
      equipo_frio_id: '',
      fecha: new Date().toISOString().slice(0, 10),
      hora: getHoraActual(),
      temperatura_declarada: '4.5',
      estado: 'correcto',
      puerta_ok: true,
      equipo_ok: true,
      limpieza_ok: true,
      observaciones: '',
      firmado: true,
    });
  };

  const renderNav = () => (
    <div style={styles.navTabs}>
      <button
        type="button"
        style={vista === 'reportes' ? styles.navButtonActive : styles.navButton}
        onClick={() => setVista('reportes')}
      >
        Reportes
      </button>

      {isAdmin && (
        <button
          type="button"
          style={vista === 'ubicaciones' ? styles.navButtonActive : styles.navButton}
          onClick={() => setVista('ubicaciones')}
        >
          Ubicaciones
        </button>
      )}

      {isAdmin && (
        <button
          type="button"
          style={vista === 'equipos' ? styles.navButtonActive : styles.navButton}
          onClick={() => setVista('equipos')}
        >
          Equipos
        </button>
      )}

      {isAdmin && (
        <button
          type="button"
          style={vista === 'usuarios' ? styles.navButtonActive : styles.navButton}
          onClick={() => setVista('usuarios')}
        >
          Usuarios
        </button>
      )}

      {isAdmin && (
        <button
          type="button"
          style={vista === 'envio-reportes' ? styles.navButtonActive : styles.navButton}
          onClick={() => setVista('envio-reportes')}
        >
          PDF / Email
        </button>
      )}
    </div>
  );

  const renderVistaReportes = () => (
    <div style={styles.grid2}>
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Nuevo reporte</h2>

        <form onSubmit={guardarReporte} style={styles.form}>
          <div style={styles.scanBox}>
            <h3 style={styles.scanTitle}>Escaneo de nevera</h3>
            <p style={styles.scanHelp}>
              Escanea el código de barras o escríbelo manualmente y pulsa Enter.
            </p>

            <input
              ref={barcodeInputRef}
              style={styles.scanInput}
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              onKeyDown={handleBarcodeKeyDown}
              placeholder="Escanear código"
            />

            <div style={styles.scanResult}>
              {scannerMessage || 'Esperando lectura del escáner'}
            </div>
          </div>

          <label style={styles.label}>
            Ubicación
            <select
              style={styles.select}
              name="vehiculo_id"
              value={form.vehiculo_id}
              onChange={handleFormChange}
            >
              {ubicaciones.length === 0 ? (
                <option value="">Sin ubicaciones</option>
              ) : (
                ubicaciones.map((u) => (
                  <option key={u.id} value={u.id}>
                    {formatearUbicacion(u)}
                  </option>
                ))
              )}
            </select>
          </label>

          <label style={styles.label}>
            Equipo de frío
            <select
              style={styles.select}
              name="equipo_frio_id"
              value={form.equipo_frio_id}
              onChange={handleFormChange}
            >
              {equiposFiltrados.length === 0 ? (
                <option value="">Sin equipos en esta ubicación</option>
              ) : (
                equiposFiltrados.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.nombre || e.codigo_equipo}
                    {e.numero_serie ? ` - Serie: ${e.numero_serie}` : ''}
                  </option>
                ))
              )}
            </select>
          </label>

          <div style={styles.row2}>
            <label style={styles.label}>
              Fecha
              <input
                style={styles.input}
                type="date"
                name="fecha"
                value={form.fecha}
                onChange={handleFormChange}
              />
            </label>

            <label style={styles.label}>
              Hora
              <input
                style={styles.input}
                type="time"
                step="1"
                name="hora"
                value={form.hora}
                onChange={handleFormChange}
              />
            </label>
          </div>

          <div style={styles.row2}>
            <label style={styles.label}>
              Temperatura declarada
              <input
                style={styles.input}
                type="number"
                step="0.1"
                name="temperatura_declarada"
                value={form.temperatura_declarada}
                onChange={handleFormChange}
              />
            </label>

            <label style={styles.label}>
              Estado
              <select
                style={styles.select}
                name="estado"
                value={form.estado}
                onChange={handleFormChange}
              >
                <option value="correcto">Correcto</option>
                <option value="alerta">Alerta</option>
                <option value="incidencia">Incidencia</option>
              </select>
            </label>
          </div>

          <div style={styles.checkboxGrid}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="puerta_ok"
                checked={form.puerta_ok}
                onChange={handleFormChange}
              />
              Puerta OK
            </label>

            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="equipo_ok"
                checked={form.equipo_ok}
                onChange={handleFormChange}
              />
              Equipo OK
            </label>

            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="limpieza_ok"
                checked={form.limpieza_ok}
                onChange={handleFormChange}
              />
              Limpieza OK
            </label>

            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="firmado"
                checked={form.firmado}
                onChange={handleFormChange}
              />
              Firmado
            </label>
          </div>

          <label style={styles.label}>
            Observaciones
            <textarea
              style={styles.textarea}
              name="observaciones"
              value={form.observaciones}
              onChange={handleFormChange}
              placeholder="Observaciones del reporte"
            />
          </label>

          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar reporte'}
          </button>
        </form>
      </div>

      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Reportes de hoy</h2>

        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Fecha</th>
                <th style={styles.th}>Vehículo/Ubicación</th>
                <th style={styles.th}>Equipo</th>
                <th style={styles.th}>Hora</th>
                <th style={styles.th}>Temp.</th>
                <th style={styles.th}>Estado</th>
                <th style={styles.th}>Usuario</th>
                <th style={styles.th}>Observaciones</th>
              </tr>
            </thead>
            <tbody>
              {(Array.isArray(reportes) ? reportes : []).map((r) => (
                <tr key={r.id}>
                  <td style={styles.td}>{r.fecha || '-'}</td>
                  <td style={styles.td}>{r.vehiculo || r.ubicacion || '-'}</td>
                  <td style={styles.td}>{r.equipo || r.codigo_equipo || '-'}</td>
                  <td style={styles.td}>{r.hora || '-'}</td>
                  <td style={styles.td}>{r.temperatura_declarada} ºC</td>
                  <td style={styles.td}>
                    <span style={estadoStyle(r.estado)}>{r.estado}</span>
                  </td>
                  <td style={styles.td}>{r.username || '-'}</td>
                  <td style={styles.td}>{r.observaciones || '-'}</td>
                </tr>
              ))}
              {reportes.length === 0 ? (
                <tr>
                  <td style={styles.td} colSpan={8}>
                    No hay reportes registrados hoy.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderVistaUbicaciones = () => (
    <div style={styles.grid2}>
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>
          {editandoUbicacionId ? 'Editar ubicación' : 'Nueva ubicación'}
        </h2>

        <form onSubmit={guardarUbicacion} style={styles.form}>
          <div style={styles.row2}>
            <label style={styles.label}>
              Tipo
              <select
                style={styles.select}
                name="tipo"
                value={ubicacionForm.tipo}
                onChange={handleUbicacionFormChange}
              >
                <option value="vehiculo">Vehículo</option>
                <option value="nave">Nave</option>
                <option value="supermercado">Supermercado</option>
                <option value="almacen">Almacén</option>
                <option value="otro">Otro</option>
              </select>
            </label>

            <label style={styles.label}>
              Código
              <input
                style={styles.input}
                name="codigo"
                value={ubicacionForm.codigo}
                onChange={handleUbicacionFormChange}
                placeholder="Código interno"
              />
            </label>
          </div>

          <label style={styles.label}>
            Nombre
            <input
              style={styles.input}
              name="nombre"
              value={ubicacionForm.nombre}
              onChange={handleUbicacionFormChange}
              placeholder="Ej. Camión Frío 3 / Nave 1 / Supermercado Centro"
            />
          </label>

          <div style={styles.row3}>
            <label style={styles.label}>
              Matrícula
              <input
                style={styles.input}
                name="matricula"
                value={ubicacionForm.matricula}
                onChange={handleUbicacionFormChange}
                placeholder="Solo si aplica"
              />
            </label>

            <label style={styles.label}>
              Marca
              <input
                style={styles.input}
                name="marca"
                value={ubicacionForm.marca}
                onChange={handleUbicacionFormChange}
                placeholder="Marca"
              />
            </label>

            <label style={styles.label}>
              Modelo
              <input
                style={styles.input}
                name="modelo"
                value={ubicacionForm.modelo}
                onChange={handleUbicacionFormChange}
                placeholder="Modelo"
              />
            </label>
          </div>

          <div style={styles.row2}>
            <label style={styles.label}>
              Dirección
              <input
                style={styles.input}
                name="direccion"
                value={ubicacionForm.direccion}
                onChange={handleUbicacionFormChange}
                placeholder="Dirección"
              />
            </label>

            <label style={styles.label}>
              Ciudad
              <input
                style={styles.input}
                name="ciudad"
                value={ubicacionForm.ciudad}
                onChange={handleUbicacionFormChange}
                placeholder="Ciudad"
              />
            </label>
          </div>

          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              name="activo"
              checked={ubicacionForm.activo}
              onChange={handleUbicacionFormChange}
            />
            Activa
          </label>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button style={styles.button} type="submit" disabled={loading}>
              {loading
                ? 'Guardando...'
                : editandoUbicacionId
                ? 'Actualizar ubicación'
                : 'Guardar ubicación'}
            </button>

            {editandoUbicacionId && (
              <button
                type="button"
                style={styles.buttonSecondary}
                onClick={cancelarEdicionUbicacion}
              >
                Cancelar edición
              </button>
            )}
          </div>
        </form>
      </div>

      <div style={styles.card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, marginBottom: 16 }}>
          <h2 style={{ ...styles.cardTitle, marginBottom: 0 }}>Ubicaciones</h2>
          <button
            style={styles.buttonSecondary}
            type="button"
            onClick={async () => {
              setError('');
              setSuccess('');
              try {
                await cargarUbicaciones();
              } catch (err) {
                setError(err.message);
              }
            }}
          >
            Recargar
          </button>
        </div>

        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Nombre</th>
                <th style={styles.th}>Tipo</th>
                <th style={styles.th}>Código</th>
                <th style={styles.th}>Matrícula</th>
                <th style={styles.th}>Marca</th>
                <th style={styles.th}>Modelo</th>
                <th style={styles.th}>Ciudad</th>
                <th style={styles.th}>Estado</th>
                <th style={styles.th}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ubicaciones.map((u) => (
                <tr key={u.id}>
                  <td style={styles.td}>{u.nombre || '-'}</td>
                  <td style={styles.td}>{u.tipo || '-'}</td>
                  <td style={styles.td}>{u.codigo || '-'}</td>
                  <td style={styles.td}>{u.matricula || '-'}</td>
                  <td style={styles.td}>{u.marca || '-'}</td>
                  <td style={styles.td}>{u.modelo || '-'}</td>
                  <td style={styles.td}>{u.ciudad || '-'}</td>
                  <td style={styles.td}>
                    <span style={u.activo ? estadoStyle('activa') : estadoStyle('inactiva')}>
                      {u.activo ? 'activa' : 'inactiva'}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <div style={styles.actionsCell}>
                      <button
                        type="button"
                        style={styles.buttonEdit}
                        onClick={() => editarUbicacion(u)}
                      >
                        Editar
                      </button>
                      {u.activo && (
                        <button
                          type="button"
                          style={styles.buttonDanger}
                          onClick={() => desactivarUbicacion(u.id)}
                        >
                          Desactivar
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {ubicaciones.length === 0 ? (
                <tr>
                  <td style={styles.td} colSpan={9}>
                    No hay ubicaciones registradas.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderVistaEquipos = () => (
    <div style={styles.grid2}>
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>
          {editandoEquipoId ? 'Editar equipo de frío' : 'Nuevo equipo de frío'}
        </h2>

        <form onSubmit={guardarEquipo} style={styles.form}>
          <label style={styles.label}>
            Ubicación
            <select
              style={styles.select}
              name="ubicacion_id"
              value={equipoForm.ubicacion_id}
              onChange={handleEquipoFormChange}
            >
              {ubicaciones.length === 0 ? (
                <option value="">Sin ubicaciones</option>
              ) : (
                ubicaciones.map((u) => (
                  <option key={u.id} value={u.id}>
                    {formatearUbicacion(u)}
                  </option>
                ))
              )}
            </select>
          </label>

          <div style={styles.row2}>
            <label style={styles.label}>
              Código equipo
              <input
                style={styles.input}
                name="codigo_equipo"
                value={equipoForm.codigo_equipo}
                onChange={handleEquipoFormChange}
                placeholder="Ej. EQ-FRIO-003"
              />
            </label>

            <label style={styles.label}>
              Nombre
              <input
                style={styles.input}
                name="nombre"
                value={equipoForm.nombre}
                onChange={handleEquipoFormChange}
                placeholder="Ej. Nevera Cabina 3"
              />
            </label>
          </div>

          <label style={styles.label}>
            Descripción
            <textarea
              style={styles.textarea}
              name="descripcion"
              value={equipoForm.descripcion}
              onChange={handleEquipoFormChange}
              placeholder="Descripción del equipo"
            />
          </label>

          <div style={styles.row3}>
            <label style={styles.label}>
              Tipo equipo
              <select
                style={styles.select}
                name="tipo_equipo"
                value={equipoForm.tipo_equipo}
                onChange={handleEquipoFormChange}
              >
                <option value="refrigerado">Refrigerado</option>
                <option value="congelado">Congelado</option>
                <option value="mixto">Mixto</option>
                <option value="otro">Otro</option>
              </select>
            </label>

            <label style={styles.label}>
              Rango mín. temp
              <input
                style={styles.input}
                type="number"
                step="0.1"
                name="rango_min_temp"
                value={equipoForm.rango_min_temp}
                onChange={handleEquipoFormChange}
                placeholder="Ej. 2"
              />
            </label>

            <label style={styles.label}>
              Rango máx. temp
              <input
                style={styles.input}
                type="number"
                step="0.1"
                name="rango_max_temp"
                value={equipoForm.rango_max_temp}
                onChange={handleEquipoFormChange}
                placeholder="Ej. 8"
              />
            </label>
          </div>

          <div style={styles.row2}>
            <label style={styles.label}>
              Marca
              <input
                style={styles.input}
                name="marca"
                value={equipoForm.marca}
                onChange={handleEquipoFormChange}
                placeholder="Marca"
              />
            </label>

            <label style={styles.label}>
              Modelo
              <input
                style={styles.input}
                name="modelo"
                value={equipoForm.modelo}
                onChange={handleEquipoFormChange}
                placeholder="Modelo"
              />
            </label>
          </div>

          <div style={styles.row3}>
            <label style={styles.label}>
              Número de serie
              <input
                style={styles.input}
                name="numero_serie"
                value={equipoForm.numero_serie}
                onChange={handleEquipoFormChange}
                placeholder="Número de serie"
              />
            </label>

            <label style={styles.label}>
              Código de barras
              <input
                style={styles.input}
                name="codigo_barras"
                value={equipoForm.codigo_barras}
                onChange={handleEquipoFormChange}
                placeholder="Código de barras"
              />
            </label>

            <label style={styles.label}>
              Ubicación interna
              <input
                style={styles.input}
                name="ubicacion"
                value={equipoForm.ubicacion}
                onChange={handleEquipoFormChange}
                placeholder="Ej. Cabina principal"
              />
            </label>
          </div>

          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              name="activo"
              checked={equipoForm.activo}
              onChange={handleEquipoFormChange}
            />
            Activo
          </label>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button style={styles.button} type="submit" disabled={loading}>
              {loading
                ? 'Guardando...'
                : editandoEquipoId
                ? 'Actualizar equipo'
                : 'Guardar equipo'}
            </button>

            {editandoEquipoId && (
              <button
                type="button"
                style={styles.buttonSecondary}
                onClick={cancelarEdicionEquipo}
              >
                Cancelar edición
              </button>
            )}
          </div>
        </form>
      </div>

      <div style={styles.card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, marginBottom: 16 }}>
          <h2 style={{ ...styles.cardTitle, marginBottom: 0 }}>Equipos de frío</h2>
          <button
            style={styles.buttonSecondary}
            type="button"
            onClick={async () => {
              setError('');
              setSuccess('');
              try {
                await cargarEquipos();
              } catch (err) {
                setError(err.message);
              }
            }}
          >
            Recargar
          </button>
        </div>

        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Nombre</th>
                <th style={styles.th}>Código</th>
                <th style={styles.th}>Ubicación</th>
                <th style={styles.th}>Tipo</th>
                <th style={styles.th}>Marca</th>
                <th style={styles.th}>Modelo</th>
                <th style={styles.th}>Serie</th>
                <th style={styles.th}>Código barras</th>
                <th style={styles.th}>Estado</th>
                <th style={styles.th}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {equipos.map((e) => (
                <tr key={e.id}>
                  <td style={styles.td}>{e.nombre || '-'}</td>
                  <td style={styles.td}>{e.codigo_equipo || '-'}</td>
                  <td style={styles.td}>{e.ubicacion_nombre || '-'}</td>
                  <td style={styles.td}>{e.tipo_equipo || '-'}</td>
                  <td style={styles.td}>{e.marca || '-'}</td>
                  <td style={styles.td}>{e.modelo || '-'}</td>
                  <td style={styles.td}>{e.numero_serie || '-'}</td>
                  <td style={styles.td}>{e.codigo_barras || '-'}</td>
                  <td style={styles.td}>
                    <span style={e.activo ? estadoStyle('activo') : estadoStyle('inactivo')}>
                      {e.activo ? 'activo' : 'inactivo'}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <div style={styles.actionsCell}>
                      <button
                        type="button"
                        style={styles.buttonEdit}
                        onClick={() => editarEquipo(e)}
                      >
                        Editar
                      </button>
                      {e.activo && (
                        <button
                          type="button"
                          style={styles.buttonDanger}
                          onClick={() => desactivarEquipo(e.id)}
                        >
                          Desactivar
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {equipos.length === 0 ? (
                <tr>
                  <td style={styles.td} colSpan={10}>
                    No hay equipos registrados.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderVistaUsuarios = () => (
    <div style={styles.grid2}>
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>
          {editandoUsuarioId ? 'Editar usuario' : 'Nuevo usuario'}
        </h2>

        <form onSubmit={guardarUsuario} style={styles.form}>
          <label style={styles.label}>
            Username
            <input
              style={styles.input}
              name="username"
              value={usuarioForm.username}
              onChange={handleUsuarioFormChange}
              placeholder="Usuario de acceso"
            />
          </label>

          <label style={styles.label}>
            Nombre completo
            <input
              style={styles.input}
              name="nombre_completo"
              value={usuarioForm.nombre_completo}
              onChange={handleUsuarioFormChange}
              placeholder="Nombre completo"
            />
          </label>

          <div style={styles.row2}>
            <label style={styles.label}>
              Contraseña
              <input
                style={styles.input}
                type="password"
                name="password"
                value={usuarioForm.password}
                onChange={handleUsuarioFormChange}
                placeholder={
                  editandoUsuarioId
                    ? 'Solo rellena si quieres cambiarla'
                    : 'Contraseña'
                }
              />
            </label>

            <label style={styles.label}>
              Rol
              <select
                style={styles.select}
                name="rol"
                value={usuarioForm.rol}
                onChange={handleUsuarioFormChange}
              >
                <option value="usuario">Usuario</option>
                <option value="admin">Admin</option>
              </select>
            </label>
          </div>

          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              name="activo"
              checked={usuarioForm.activo}
              onChange={handleUsuarioFormChange}
            />
            Usuario activo
          </label>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button style={styles.button} type="submit" disabled={loading}>
              {loading
                ? 'Guardando...'
                : editandoUsuarioId
                ? 'Actualizar usuario'
                : 'Crear usuario'}
            </button>

            {editandoUsuarioId && (
              <button
                type="button"
                style={styles.buttonSecondary}
                onClick={cancelarEdicionUsuario}
              >
                Cancelar edición
              </button>
            )}
          </div>
        </form>
      </div>

      <div style={styles.card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, marginBottom: 16 }}>
          <h2 style={{ ...styles.cardTitle, marginBottom: 0 }}>Usuarios</h2>
          <button
            style={styles.buttonSecondary}
            type="button"
            onClick={async () => {
              setError('');
              setSuccess('');
              try {
                await cargarUsuarios();
              } catch (err) {
                setError(err.message);
              }
            }}
          >
            Recargar
          </button>
        </div>

        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Username</th>
                <th style={styles.th}>Nombre completo</th>
                <th style={styles.th}>Rol</th>
                <th style={styles.th}>Estado</th>
                <th style={styles.th}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id}>
                  <td style={styles.td}>{u.username || '-'}</td>
                  <td style={styles.td}>{u.nombre_completo || '-'}</td>
                  <td style={styles.td}>{u.rol || '-'}</td>
                  <td style={styles.td}>
                    <span style={u.activo ? estadoStyle('activo') : estadoStyle('inactivo')}>
                      {u.activo ? 'activo' : 'inactivo'}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <div style={styles.actionsCell}>
                      <button
                        type="button"
                        style={styles.buttonEdit}
                        onClick={() => editarUsuario(u)}
                      >
                        Editar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {usuarios.length === 0 ? (
                <tr>
                  <td style={styles.td} colSpan={5}>
                    No hay usuarios registrados.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderVistaEnvioReportes = () => (
    <div style={styles.grid2}>
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>PDF de reportes</h2>

        <form onSubmit={(e) => e.preventDefault()} style={styles.form}>
          <div style={styles.row2}>
            <label style={styles.label}>
              Fecha desde
              <input
                style={styles.input}
                type="date"
                name="fecha_desde"
                value={reporteMailForm.fecha_desde}
                onChange={handleReporteMailFormChange}
              />
            </label>

            <label style={styles.label}>
              Fecha hasta
              <input
                style={styles.input}
                type="date"
                name="fecha_hasta"
                value={reporteMailForm.fecha_hasta}
                onChange={handleReporteMailFormChange}
              />
            </label>
          </div>

          <label style={styles.label}>
            Destinatarios
            <input
              style={styles.input}
              name="destinatarios"
              value={reporteMailForm.destinatarios}
              onChange={handleReporteMailFormChange}
              placeholder="info@token.es, otro@empresa.com"
            />
          </label>

          <label style={styles.label}>
            Asunto
            <input
              style={styles.input}
              name="asunto"
              value={reporteMailForm.asunto}
              onChange={handleReporteMailFormChange}
              placeholder="Ej. Reporte de temperaturas semanal"
            />
          </label>

          <label style={styles.label}>
            Mensaje
            <textarea
              style={styles.textarea}
              name="mensaje"
              value={reporteMailForm.mensaje}
              onChange={handleReporteMailFormChange}
              placeholder="Adjunto se envía el reporte solicitado."
            />
          </label>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button
              type="button"
              style={styles.buttonSecondary}
              onClick={descargarPdfReportes}
              disabled={loading}
            >
              {loading ? 'Procesando...' : 'Descargar PDF'}
            </button>

            <button
              type="button"
              style={styles.button}
              onClick={enviarPdfReportesPorEmail}
              disabled={loading}
            >
              {loading ? 'Enviando...' : 'Enviar PDF por email'}
            </button>
          </div>
        </form>
      </div>

      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Uso</h2>
        <div style={{ color: '#475569', lineHeight: 1.8 }}>
          <p>Selecciona el rango de fechas que quieres incluir en el informe.</p>
          <p>Puedes descargar primero el PDF para revisarlo antes de enviarlo.</p>
          <p>Si quieres enviar a varios correos, sepáralos por comas.</p>
        </div>
      </div>
    </div>
  );

  if (!isLogged) {
    return (
      <div style={styles.page}>
        <div style={styles.wrapper}>
          <div style={styles.headerCard}>
            <h1 style={styles.title}>Control de temperaturas</h1>
            <p style={styles.subtitle}>Neveras y ubicaciones · Panel web</p>
          </div>

          {error ? <div style={styles.error}>{error}</div> : null}
          {success ? <div style={styles.success}>{success}</div> : null}

          <div style={styles.loginGrid}>
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>Iniciar sesión</h2>

              <form onSubmit={login} style={styles.form}>
                <label style={styles.label}>
                  Usuario
                  <input
                    style={styles.input}
                    name="username"
                    value={loginData.username}
                    onChange={handleLoginChange}
                    placeholder="Usuario"
                  />
                </label>

                <label style={styles.label}>
                  Contraseña
                  <input
                    style={styles.input}
                    type="password"
                    name="password"
                    value={loginData.password}
                    onChange={handleLoginChange}
                    placeholder="Contraseña"
                  />
                </label>

                <button style={styles.button} type="submit" disabled={loading}>
                  {loading ? 'Entrando...' : 'Entrar'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.wrapper}>
        <div style={styles.headerCard}>
          <div style={styles.topBar}>
            <div>
              <h1 style={styles.title}>Bienvenido {user?.username}</h1>
              <p style={styles.subtitle}>
                Usuario: {user?.nombre_completo || user?.username} · Rol: {user?.rol}
              </p>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                style={styles.buttonSecondary}
                onClick={async () => {
                  setError('');
                  setSuccess('');
                  try {
                    await cargarTodoInicial();
                  } catch (err) {
                    setError(err.message);
                  }
                }}
              >
                Recargar
              </button>
              <button style={styles.button} onClick={salir}>
                Salir
              </button>
            </div>
          </div>

          {renderNav()}
        </div>

        {error ? <div style={styles.error}>{error}</div> : null}
        {success ? <div style={styles.success}>{success}</div> : null}

        {vista === 'reportes' && renderVistaReportes()}
        {vista === 'ubicaciones' && isAdmin && renderVistaUbicaciones()}
        {vista === 'equipos' && isAdmin && renderVistaEquipos()}
        {vista === 'usuarios' && isAdmin && renderVistaUsuarios()}
        {vista === 'envio-reportes' && isAdmin && renderVistaEnvioReportes()}
      </div>
    </div>
  );
}