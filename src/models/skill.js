const { v4: uuidv4 } = require("uuid");
const pool = require("../configs/db");

const selectAll = () => {
  return pool.query("SELECT * FROM skills ORDER BY id ASC");
};

const selectDetail = async (user_id) => {
  const query = `SELECT id, skill_name, created_at, updated_at FROM skills WHERE user_id = $1`;
  return await pool.query(query, [user_id]);
};

const create = ({ skill_name, user_id }) => {
  const id = uuidv4();
  return pool.query(
    `INSERT INTO skills (id, skill_name, user_id) VALUES ($1, $2, $3)`,
    [id, skill_name, user_id]
  );
};

const drop = (id) => {
  return pool.query("DELETE FROM skills WHERE id = $1", [id]);
};

module.exports = {
  selectAll,
  selectDetail,
  create,
  drop,
};
