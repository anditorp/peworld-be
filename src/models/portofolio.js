const { v4: uuidv4 } = require("uuid");
const pool = require("../configs/db");

const selectAll = () => {
  return pool.query("SELECT * FROM portofolio ORDER BY id ASC");
};

const selectDetail = async (user_id) => {
  const query = `SELECT * FROM portofolio WHERE user_id = $1`;
  return await pool.query(query, [user_id]);
};

const create = async ({
  user_id,
  application_name,
  link_repository,
  application,
  image,
}) => {
  const id = uuidv4();
  const query = `
    INSERT INTO portofolio (id, user_id, application_name, link_repository, application, image) 
    VALUES ($1, $2, $3, $4, $5, $6)
  `;
  const values = [
    id,
    user_id,
    application_name,
    link_repository,
    application,
    image.secure_url,
  ];
  return await pool.query(query, values);
};

const drop = (id) => {
  return pool.query("DELETE FROM portofolio WHERE id = $1", [id]);
};

const update = (data, id) => {
  return pool.query(
    "UPDATE portofolio SET application_name = $1, link_repository = $2, application = $3, image = $4 WHERE id = $5",
    [
      data.application_name,
      data.link_repository,
      data.application,
      data.image,
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
