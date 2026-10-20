import mysql from 'mysql2/promise';

const g = globalThis as any;
g._mysql ||= { pool: null, ready: null };

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS categories (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT NULL,
    image VARCHAR(1024) NULL,
    \`order\` INT NOT NULL DEFAULT 0,
    createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
  `CREATE TABLE IF NOT EXISTS products (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT NULL,
    price DECIMAL(10,2) NOT NULL,
    comparePrice DECIMAL(10,2) NULL,
    images JSON NULL,
    category INT UNSIGNED NULL,
    featured TINYINT(1) NOT NULL DEFAULT 0,
    active TINYINT(1) NOT NULL DEFAULT 1,
    createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    CONSTRAINT fk_products_category FOREIGN KEY (category) REFERENCES categories(id) ON DELETE SET NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
  `CREATE TABLE IF NOT EXISTS posts (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    excerpt TEXT NULL,
    content MEDIUMTEXT NULL,
    cover VARCHAR(1024) NULL,
    published TINYINT(1) NOT NULL DEFAULT 0,
    publishedAt DATETIME(3) NULL,
    createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
  `CREATE TABLE IF NOT EXISTS users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(190) NOT NULL UNIQUE,
    phone VARCHAR(40) NULL,
    passwordHash VARCHAR(255) NOT NULL,
    createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
  `CREATE TABLE IF NOT EXISTS settings (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    \`key\` VARCHAR(64) NOT NULL UNIQUE DEFAULT 'main',
    layout VARCHAR(32) NOT NULL DEFAULT 'festa',
    storeName VARCHAR(255) NULL,
    whatsapp VARCHAR(64) NULL,
    heroTitle VARCHAR(255) NULL,
    heroSubtitle TEXT NULL,
    instagram VARCHAR(512) NULL,
    email VARCHAR(255) NULL,
    address VARCHAR(512) NULL,
    aboutText TEXT NULL,
    createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
];

/** Colunas adicionadas depois da criação inicial das tabelas (também aplicadas em bancos já existentes). */
const COLUMNS: [table: string, column: string, ddl: string][] = [
  ['settings', 'fxLevel', 'VARCHAR(16) NULL'],
  ['settings', 'fxStyle', 'VARCHAR(24) NULL'],
  ['settings', 'siteUrl', 'VARCHAR(255) NULL'],
  ['settings', 'seoTitle', 'VARCHAR(255) NULL'],
  ['settings', 'seoDescription', 'TEXT NULL'],
  ['settings', 'seoKeywords', 'TEXT NULL'],
  ['settings', 'ogTitle', 'VARCHAR(255) NULL'],
  ['settings', 'ogDescription', 'TEXT NULL'],
  ['settings', 'ogImage', 'VARCHAR(1024) NULL'],
];

function pool(): mysql.Pool {
  return (g._mysql.pool ||= mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 8506),
    user: process.env.DB_USER || 'luana',
    password: process.env.DB_PASSWORD || 'luana',
    database: process.env.DB_NAME || 'luana',
    charset: 'utf8mb4',
    timezone: 'Z',
    decimalNumbers: true,
    connectionLimit: 10,
    connectTimeout: 5000,
  }));
}

/** Garante a conexão e cria as tabelas na primeira chamada. */
export function connectDB() {
  g._mysql.ready ||= (async () => {
    for (const ddl of SCHEMA) await pool().query(ddl);
    for (const [table, column, ddl] of COLUMNS) {
      const [rows]: any = await pool().query(
        'SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?',
        [table, column],
      );
      if (!rows.length) await pool().query(`ALTER TABLE \`${table}\` ADD COLUMN \`${column}\` ${ddl}`);
    }
  })().catch((e) => {
    g._mysql.ready = null;
    throw e;
  });
  return g._mysql.ready as Promise<void>;
}

export async function query<T = any>(sql: string, params: any[] | Record<string, any> = []): Promise<T> {
  const [rows] = await pool().query(sql, params);
  return rows as T;
}
