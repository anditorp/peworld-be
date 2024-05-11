const pool = require("../configs/db");
const findByemail = (email) => {
  return pool.query("SELECT * FROM users where email = $1", [email]);
};

const create = ({ id, email, password, role }) => {
  return pool.query(
    "INSERT INTO users (id, email, password, role) VALUES ($1, $2, $3, $4)",
    [id, email, password, role]
  );
};
module.exports = {
  findByemail,
  create,
};
