const bcrypt = require("bcryptjs");

function hashPassword(password) {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}

function checkPassword(login, hashedPassword) {
  return bcrypt.compareSync(login, hashedPassword)
}

module.exports = { hashPassword, checkPassword }