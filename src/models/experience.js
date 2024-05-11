const { v4: uuidv4 } = require("uuid");
const pool = require("../configs/db");

const selectAll = () => {
  return pool.query("SELECT * FROM experience ORDER BY id ASC");
};

const selectDetail = (id) => {
  return pool.query("SELECT * FROM experience WHERE id = $1", [id]);
};

const create = ({ position, company, work_month, work_year, description }) => {
  const id = uuidv4();
  return pool.query(
    `INSERT INTO experience (id, position, company, work_month, work_year, description) VALUES ($1, $2, $3, $4, $5, $6)`,
    [id, position, company, work_month, work_year, description]
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
