const { Pool } = require("pg");
require("dotenv").config();

// could use prisma for better structure

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

module.exports = pool;
