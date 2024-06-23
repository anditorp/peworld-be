const pool = require("../configs/db");

const findByEmail = (email, { relation } = { relation: "" }) => {
  return pool.query(
    `SELECT users.id AS user_id, users.email, users.password, users.role ${
      relation ? `, ${relation}.*` : ""
    } FROM users ${
      relation ? ` JOIN ${relation} ON users.id = ${relation}.user_id` : ""
    } WHERE users.email = $1`,
    [email]
  );
};

const create = ({ id, email, password, role }) => {
  return pool.query(
    "INSERT INTO users (id, email, password, role) VALUES ($1, $2, $3, $4)",
    [id, email, password, role]
  );
};
module.exports = {
  findByEmail,
  create,
};
