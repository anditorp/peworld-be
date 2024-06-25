const { v4: uuidv4 } = require("uuid");
const pool = require("../configs/db");

const selectAll = () => {
  return pool.query("SELECT * FROM experience ORDER BY id ASC");
};

const selectDetail = async (user_id) => {
  const query = `SELECT * FROM experience WHERE user_id = $1`;
  return await pool.query(query, [user_id]);
};

const create = ({
  position,
  company,
  work_month,
  work_year,
  description,
  user_id,
}) => {
  const id = uuidv4();
  return pool.query(
    `INSERT INTO experience (id, position, company, work_month, work_year, description, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [id, position, company, work_month, work_year, description, user_id]
  );
};

const drop = (id) => {
  return pool.query("DELETE FROM experience WHERE id = $1", [id]);
};

const update = (data, id) => {
  return pool.query(
    "UPDATE experience SET position= $1, company= $2, work_month= $3, work_year= $4, description= $5 WHERE id = $6",
    [
      data.position,
      data.company,
      data.work_month,
      data.work_year,
      data.description,
      id,
    ]
  );
};

module.exports = {
  selectAll,
  selectDetail,
  create,
  drop,
  update,
};
