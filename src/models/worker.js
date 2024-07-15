const pool = require("../configs/db");

const selectAllWorker = ({ limit, offset, sort, sortBy, search }) => {
  let query = `
    SELECT
      w.id,
      w.name,
      w.phone,
      w.job_desc,
      w.domicile,
      w.workplace,
      w.photo,
      COALESCE(json_agg(json_build_object('id', s.id, 'skill_name', s.skill_name)) FILTER (WHERE s.id IS NOT NULL), '[]') AS skills
    FROM worker w
    LEFT JOIN skills s ON w.user_id = s.user_id
  `;

  const queryParams = [];

  if (search) {
    query += " WHERE w.name ILIKE $1";
    queryParams.push(`%${search}%`);
  }

  query += ` GROUP BY w.id`;

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

const selectWorkerById = (id) => {
  return pool.query(
    `
    SELECT
      w.id,
      w.name,
      w.phone,
      w.job_desc,
      w.domicile,
      w.workplace,
      w.photo,
      w.description,
      COALESCE(json_agg(json_build_object('id', s.id, 'skill_name', s.skill_name)) FILTER (WHERE s.id IS NOT NULL), '[]') AS skills
    FROM worker w
    LEFT JOIN skills s ON w.user_id = s.user_id
    WHERE w.id = $1
    GROUP BY w.id
    `,
    [id]
  );
};

const selectDetailWorker = (user_id) => {
  return pool.query(
    `
    SELECT
    w.id,
      w.name,
      w.phone,
      w.job_desc,
      w.domicile,
      w.workplace,
      w.photo,
      w.description,
      COALESCE(json_agg(json_build_object('id', s.id, 'skill_name', s.skill_name)) FILTER (WHERE s.id IS NOT NULL), '[]') AS skills
    FROM worker w
    LEFT JOIN skills s ON w.user_id = s.user_id
    WHERE w.user_id = $1
    GROUP BY w.id
    `,
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
    "UPDATE worker SET name = $1, job_desc = $2, domicile = $3, workplace = $4, description = $5, photo = $6 WHERE user_id = $7",
    [
      data.name,
      data.job_desc,
      data.domicile,
      data.workplace,
      data.description,
      data.photo,
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
  selectWorkerById,
};
