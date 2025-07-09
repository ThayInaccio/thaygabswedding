"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pg_1 = require("pg");
var dotenv = require("dotenv");
dotenv.config();
var pool = new pg_1.Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'wedding_db',
    password: process.env.DB_PASSWORD || 'password',
    port: parseInt(process.env.DB_PORT || '5432'),
});
// Test the connection
pool.on('connect', function () {
    console.log('Connected to PostgreSQL database');
});
pool.on('error', function (err) {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});
exports.default = pool;
