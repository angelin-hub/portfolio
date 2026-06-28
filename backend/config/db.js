const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // required for Neon
});

// Test connection and create tables on startup
const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id        SERIAL PRIMARY KEY,
        title       VARCHAR(100)  NOT NULL,
        description TEXT          NOT NULL,
        tech_stack  TEXT[]        NOT NULL DEFAULT '{}',
        image_url   VARCHAR(500)  DEFAULT '',
        live_url    VARCHAR(500)  DEFAULT '',
        github_url  VARCHAR(500)  DEFAULT '',
        featured    BOOLEAN       DEFAULT false,
        category    VARCHAR(50)   DEFAULT 'Web',
        created_at  TIMESTAMPTZ   DEFAULT NOW(),
        updated_at  TIMESTAMPTZ   DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS messages (
        id         SERIAL PRIMARY KEY,
        name       VARCHAR(100) NOT NULL,
        email      VARCHAR(200) NOT NULL,
        subject    VARCHAR(200) DEFAULT 'No Subject',
        message    TEXT         NOT NULL,
        read       BOOLEAN      DEFAULT false,
        created_at TIMESTAMPTZ  DEFAULT NOW()
      );
    `);
    console.log('PostgreSQL connected & tables ready (Neon)');
  } catch (error) {
    console.error('Database initialization error:', error.message);
    process.exit(1);
  }
};

module.exports = { pool, initDB };
