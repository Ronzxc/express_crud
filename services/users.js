const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getMultipleUsers(page = 1, searchQuery = '', perPage = config.listPerPage) {
  const offset = (page - 1) * perPage;
  let query = 'SELECT COUNT(*) as total FROM users';
  let params = [];
  
  if (searchQuery) {
    query += ` WHERE email LIKE ? OR firstname LIKE ? OR lastname LIKE ?`;
    params = [`%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`];
  }
  
  const totalRows = await db.query(query, params);
  const total = totalRows[0].total;

  // Execute the SQL query with LIMIT and OFFSET
  const rows = await db.query(
    `SELECT id, firstname, lastname, email FROM users ${searchQuery ? 'WHERE email LIKE ? OR firstname LIKE ? OR lastname LIKE ?' : ''} LIMIT ${offset}, ${config.listPerPage}`,
    params
  );

  const users = helper.emptyOrRows(rows);
  const meta = { page, total };

  return {
    users,
    meta
  };
}

async function getUser(id){
  const row = await db.query(
    `SELECT id, firstname, lastname,email  
    FROM users 
    WHERE id= ${id}`
  );
  const user = helper.emptyOrRows(row);
  return user[0]
}

async function saveUser(newUser){
  const row = await db.query(
    `INSERT INTO users(lastname,firstname,email) 
     VALUES ('${newUser.lastname}','${newUser.firstname}','${newUser.email}')`
  );
}

async function updateUser(newUser){
  const row = await db.query(
    `UPDATE users
    SET lastname='${newUser.lastname}',
        firstname= '${newUser.firstname}',
        email='${newUser.email}' 
    WHERE id='${newUser.id}'`
  );
}
async function deleteUser(id){
  const row = await db.query(
    `DELETE FROM users
     WHERE id='${id}'`
  );
}

module.exports = {
  getMultipleUsers,
  getUser,
  saveUser,
  updateUser,
  deleteUser
}