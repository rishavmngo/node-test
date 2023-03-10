const { Pool, Client } = require('pg')
const config = require('../config/config')
const pool = new Pool({
  user: config.user,
  host: config.host,
  database: config.database,
  password: config.password,
  port: config.dbPort,
})

;(async () => {
  const q = `
	CREATE TABLE IF NOT EXISTS users (
	uid serial PRIMARY KEY,
	displayName varchar(50) NOT NULL,
	email varchar(100) NOT NULL UNIQUE,
	password varchar(300) NOT NULL
	)`
  try {
    const result = await pool.query(q)
  } catch (err) {
    console.error('err', err)
  }
})()

module.exports = pool
