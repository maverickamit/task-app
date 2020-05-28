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
      res.status(201).send(user);
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
      res.status(201).send(task);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

// Reading User Endpoint
//Getting a list of all Users

app.get("/users", (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch((e) => {
      res.status(500).send();
    });
});

//Getting particular user details

app.get("/users/:id", (req, res) => {
  const _id = req.params.id;
  User.findById(_id)
    .then((user) => {
      if (!user) {
        res.status(404).send();
      }
      res.send(user);
    })
    .catch((e) => {
      res.status(500).send();
    });
})  ;

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
