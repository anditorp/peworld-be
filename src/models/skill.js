const { v4: uuidv4 } = require("uuid");
const pool = require("../configs/db");

const selectAll = () => {
  return pool.query("SELECT * FROM skills ORDER BY id ASC");
};

const selectDetail = (id) => {
  return pool.query("SELECT * FROM skills WHERE id = $1", [id]);
};

const create = ({ skill_name }) => {
  const id = uuidv4();
  return pool.query(`INSERT INTO skills (id, skill_name) VALUES ($1, $2)`, [
    id,
    skill_name,
  ]);
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
