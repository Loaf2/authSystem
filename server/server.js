const express = require("express");
const app = express();
const sql = require("mysql2");
const bcrypt = require("bcrypt");
require("dotenv").config();

app.use(express.json());

const connection = sql.createPool({
  host: "localhost",
  user: "root",
  password: process.env.DBPASSWORD,
  database: "usersDB",
});

app.post("/register", async (req, res) => {
  const username = req.body.username;
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  let equal = false;
  connection.query(
    "SELECT username FROM users WHERE username = ?",
    [username],
    function (err, rows, fields) {
      console.log(rows);
      if (rows.length === 0) {
        const data = JSON.stringify({ username: username });
        connection.query(
          "INSERT INTO users(username, password, data) VALUES(?,?,?)",
          [username, hashedPassword, data],
          function (err) {
            if (err) {
              console.log(err);
            }
          }
        );
        res.json("Success");
      } else {
        return res.json("Equal");
      }
    }
  );
});

app.post("/login", (req, res) => {
  const userErrMsg =
    "Your username and/or password was incorrect.  Please try again";
  const { username, password } = req.body;
  if (!username || !password) return console.log(userErrMsg);
  connection.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
    async (err, rows, fields) => {
      console.log(rows);
      if (rows.length === 0) return console.log(userErrMsg);
      const [{ password: rowPassword }] = rows;
      const [{ data: rowData }] = rows;
      const match = await bcrypt.compare(password, rowPassword);
      console.log(match);
      if (!match) return console.log(userErrMsg);
      console.log("Logged in");
      console.log(rowData);
      res.json(["Success", rowData]);
    }
  );
});

app.listen(3000);
