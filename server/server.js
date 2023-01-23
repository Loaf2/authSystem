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
  connection.query("SELECT * FROM users", function (err, rows, fields) {
    if (err) {
      console.log(err);
    }
    rows.forEach((row) => {
      if (username === row.username) {
        equal = true;
      }
    });
  });

  if (equal === true) return;
  connection.query(
    "INSERT INTO users(username, password, data) VALUES(?,?,?)",
    [username, hashedPassword, "Some data"],
    function (err) {
      if (err) {
        console.log(err);
      }
    }
  );
  res.json("Success");
});

app.post("/login", (req, res) => {
  const userErrMsg = "Your username and/or password was incorrect.  Please try again";
  const {username, password} = req.body;
  if(!username || !password) return console.log(userErrMsg);
  connection.query("SELECT * FROM users WHERE username = ?", [username], async (err, rows, fields) => {
    console.log(rows);
    const [{password: rowPassword}] = rows;
    console.log(`USER PASSWORD: ${password}\n DB PASSWORD: ${rowPassword}`);
     const match = await bcrypt.compare(password, rowPassword);
     console.log(match);
     if(!match) return console.log(userErrMsg);
     console.log("Logged in");
  });
});

app.listen(3000);
