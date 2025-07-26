require("dotenv").config(); // Charge les variables d'environnement

const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'etudiants',
  password: 'passer',
  port: 5433,
});

module.exports = pool;