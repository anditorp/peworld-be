const pool = require("../configs/db");

const create = ({
  id,
  user_id,
  message_purpose,
  worker_id,
  recruiter_id,
  name,
  phone,
  description,
  company,
}) => {
  return pool.query(
    "INSERT INTO hire (id, user_id, message_purpose, worker_id, recruiter_id, name, phone, description, company) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
    [
      id,
      user_id,
      message_purpose,
      worker_id,
      recruiter_id,
      name,
      phone,
      description,
      company,
    ]
  );
};

const selectAll = ({ filterBy, filterValue }) => {
  let query = `
    SELECT hire.id, hire.message_purpose, hire.worker_id, hire.recruiter_id, hire.name AS name_request_hire, hire.phone AS phone_request_hire, hire.description AS description_request_hire,
           worker.name AS worker_name, worker.phone AS worker_phone, worker.domicile AS worker_domicile, worker.workplace AS worker_workplace, worker.photo AS worker_photo,
           recruiter.name AS recruiter_name, recruiter.company AS recruiter_company, recruiter.position AS recruiter_position, recruiter.photo AS recruiter_photo
    FROM hire
    JOIN worker ON hire.worker_id = worker.id
    JOIN recruiter ON hire.recruiter_id = recruiter.id`;

  const params = [];
  if (filterBy && filterValue) {
    query += ` WHERE ${filterBy} = $1`;
    params.push(filterValue);
  }

  return pool.query(query, params);
};

const selectAllFromHireByRecruiter = (user_id) => {
  const query = `SELECT * FROM hire WHERE user_id = $1`;
  const params = [user_id];
  return pool.query(query, params);
};

const selectAllFromHireByWorker = (id) => {
  const query = `SELECT * FROM hire WHERE worker_id = $1`;
  const params = [id];
  return pool.query(query, params);
};

module.exports = {
  create,
  selectAll,
  selectAllFromHireByRecruiter,
  selectAllFromHireByWorker,
};
