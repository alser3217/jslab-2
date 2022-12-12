const database = require("mysql")
const connection = database.createConnection({
  host: "localhost",
  user: "root",
  password: "PKiml1902",
  database: "files"
})

connection.connect(function(err) {
  if (err) {
    console.log(err);
    return;
  }
  console.log("connection established");
})

module.exports = connection;