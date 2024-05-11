const pool = require("../configs/db");

const selectAll = () => {
  return pool.query("SELECT * FROM recruiter ORDER BY id ASC");
};

const create = ({ email, password, name, company, position, phone }) => {
  return pool.query(
    `INSERT INTO recruiter (email, password, name, company, position, phone) VALUES ($1, $2, $3, $4, $5, $6)`,
    [email, password, name, company, position, phone]
  );
};

const update = (data, id) => {
  return pool.query(
    "UPDATE recruiter SET company= $1, position= $2, city= $3, description= $4, phone= $5, instagram= $6, linkedin= $7, photo= $8 WHERE id = $9",
    [
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

module.exports = {
  selectAll,
  create,
  update,
};
