const express = require("express");
const bcrypt = require("bcryptjs");

const port = process.env.PORT || 3001;
require("./db/mongoose");
const User = require("./db/models/user");
const Task = require("./db/models/task");

const app = express();

app.use(express.json());

//Creating REST API endpoints

//Creating Users endpoint
app.post("/users", (req, res) => {
  const user = new User(req.body);
  user
    .save()
    .then((result) => {
      res.send(user);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

//Creating Tasks endpoint
app.post("/tasks", (req, res) => {
  const task = new Task(req.body);
  task
    .save()
    .then((result) => {
      res.send(task);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

//Hashing Password

const hashing = async () => {
  const Password = "1234522";
  const hashedPassword = await bcrypt.hash(Password, 8);
  console.log(Password, hashedPassword);
  const isMatch = await bcrypt.compare("Password", hashedPassword);
  console.log(isMatch);
};
hashing();

//Serving the app on port 3000
app.listen(port, () => {
  console.log("server is up on port " + port);
});
