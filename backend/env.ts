require('dotenv').config();

const { PORT, DB_USER, DB_PASSWORD, DB_HOST, DB_NAME, DB_PORT, DATABASE_URL, JWT_SECRET } = process.env;

module.exports = {
    PORT,
    DB_USER,
    DB_PASSWORD,
    DB_HOST,
    DB_NAME,
    DB_PORT,
    DATABASE_URL,
    JWT_SECRET
};