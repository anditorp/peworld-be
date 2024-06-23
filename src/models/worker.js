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

const selectDetailWorker = (user_id) => {
  return pool.query(
    "SELECT name, job_desc, domicile, workplace, description, skills, photo FROM worker WHERE user_id = $1",
    [user_id]
  );
};

const create = ({ id, name, phone, userId }) => {
  return pool.query(
    `INSERT INTO worker (id, name, phone, user_id) VALUES ($1, $2, $3, $4)`,
    [id, name, phone, userId]
  );
};

const update = (data, user_id) => {
  return pool.query(
    "UPDATE worker SET name= $1, job_desc= $2, domicile= $3, workplace= $4, description= $5 WHERE user_id = $6",
    [
      data.name,
      data.job_desc,
      data.domicile,
      data.workplace,
      data.description,
      user_id,
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
