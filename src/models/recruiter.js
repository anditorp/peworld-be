const pool = require("../configs/db");

const selectAllRecruiter = ({ limit, offset, sort, sortBy, search }) => {
  let query = `
    SELECT
      r.id,
      r.name,
      r.company,
      r.position,
      r.phone,
      r.city,
      r.photo,
      r.description,
      r.instagram,
      r.linkedin
    FROM recruiter r
  `;

  const queryParams = [];

  if (search) {
    query += " WHERE r.name ILIKE $1";
    queryParams.push(`%${search}%`);
  }

  query += ` GROUP BY r.id, r.name, r.company, r.position, r.phone, r.city, r.photo, r.description, r.instagram, r.linkedin`;

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

const selectDetailRecruiter = (user_id) => {
  return pool.query(
    `
    SELECT
      r.id,
      r.name,
      r.company,
      r.position,
      r.phone,
      r.city,
      r.photo,
      r.description,
      r.instagram,
      r.linkedin
    FROM recruiter r
    WHERE r.user_id = $1
    GROUP BY r.id, r.name, r.company, r.position, r.phone, r.city, r.photo, r.description, r.instagram, r.linkedin
    `,
    [user_id]
  );
};

const create = ({
  id,
  email,
  password,
  name,
  company,
  position,
  phone,
  userId,
}) => {
  return pool.query(
    `INSERT INTO recruiter (id, email, password, name, company, position, phone, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [id, email, password, name, company, position, phone, userId]
  );
};

const update = (data, id) => {
  return pool.query(
    "UPDATE recruiter SET name = $1, company = $2, position = $3, city = $4, description = $5, phone = $6, instagram = $7, linkedin = $8, photo = $9 WHERE id = $10",
    [
      data.name,
      data.company,
      data.position,
      data.city,
      data.description,
      data.phone,
      data.instagram,
      data.linkedin,
      data.photo,
      id,
    ]
  );
};

const countRecruiter = () => {
  return pool.query("SELECT COUNT(*) AS total FROM recruiter");
};

module.exports = {
  selectAllRecruiter,
  selectDetailRecruiter,
  create,
  update,
  countRecruiter,
};
