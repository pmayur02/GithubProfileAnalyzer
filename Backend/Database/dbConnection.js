const mysql = require("mysql2");
require("dotenv").config();
const fs = require("fs")

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl:{
    ca: fs.readFileSync(process.env.CA),
    rejectUnauthorized: false
  }
});

const db = pool.promise();

module.exports.db = db;