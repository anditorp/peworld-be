const pool = require("../configs/db");

const selectAllWorker = ({ limit, offset, sort, sortBy, search }) => {
  let query = "SELECT * FROM worker";

  const queryParams = [];

  if (search) {
    query += " WHERE name ILIKE $1";
    queryParams.push(`%${search}%`);
  }

  query += ` ORDER BY ${sort} ${sortBy}`;

  if (limit !== undefined) {
    query += ` LIMIT $${queryParams.length + 1}`;
    queryParams.push(limit);
    if (offset !== undefined) {
      query += ` OFFSET $${queryParams.length + 1}`;
      queryParams.push(offset);
    }
  }

  return pool.query(query, queryParams);
};

const selectDetailWorker = (id) => {
  return pool.query("SELECT * FROM worker WHERE id = $1", [id]);
};

const create = ({ id, name, phone, userId }) => {
  return pool.query(
    `INSERT INTO worker (id, name, phone, user_id) VALUES ($1, $2, $3, $4)`,
    [id, name, phone, userId]
  );
};

const update = (data, id) => {
  return pool.query(
    "UPDATE worker SET name= $1, job_desc= $2, domicile= $3, workplace= $4, description= $5 WHERE id = $6",
    [
      data.name,
      data.job_desc,
      data.domicile,
      data.workplace,
      data.description,
      id,
    ]
  );
};

const countWorker = () => {
  return pool.query("SELECT COUNT(*) AS total FROM worker");
};

module.exports = {
  selectAllWorker,
  selectDetailWorker,
  create,
  update,
  countWorker,
};
