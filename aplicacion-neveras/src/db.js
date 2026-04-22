import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const baseConfig = {
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
};

const testConnection = async (poolInstance, name, host, port) => {
  try {
    await poolInstance.query('SELECT 1');
    console.log(`✅ Conectado a PostgreSQL (${name}) -> ${host}:${port}`);
    return true;
  } catch (error) {
    console.log(`⚠️ No conecta por ${name} -> ${host}:${port}: ${error.message}`);
    return false;
  }
};

const createPool = async () => {
  const localHost = process.env.DB_HOST_LOCAL;
  const localPort = Number(process.env.DB_PORT_LOCAL);

  const localPool = new Pool({
    host: localHost,
    port: localPort,
    ...baseConfig,
    connectionTimeoutMillis: 2000,
  });

  if (await testConnection(localPool, 'LOCAL', localHost, localPort)) {
    console.log('📍 Usando base de datos LOCAL');
    return localPool;
  }

  await localPool.end().catch(() => {});

  const remoteHost = process.env.DB_HOST_REMOTE;
  const remotePort = Number(process.env.DB_PORT_REMOTE);

  const remotePool = new Pool({
    host: remoteHost,
    port: remotePort,
    ...baseConfig,
    connectionTimeoutMillis: 4000,
  });

  if (await testConnection(remotePool, 'REMOTO', remoteHost, remotePort)) {
    console.log('📍 Usando base de datos REMOTA');
    return remotePool;
  }

  throw new Error('❌ No se pudo conectar ni en local ni en remoto');
};

const pool = await createPool();

export { pool };
export default pool;