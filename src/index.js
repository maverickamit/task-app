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
});

// Reading Task Endpoint
//Getting a list of all Tasks

app.get("/tasks", (req, res) => {
  Task.find({})
    .then((tasks) => {
      res.send(tasks);
    })
    .catch((e) => {
      res.status(500).send();
    });
});

//Getting particular task details

app.get("/tasks/:id", (req, res) => {
  const _id = req.params.id;
  Task.findById(_id)
    .then((task) => {
      if (!task) {
        res.status(404).send();
      }
      res.send(task);
    })
    .catch((e) => {
      res.status(500).send();
    });
});

//Upding User details

app.patch("/users/:id", async (req, res) => {
  const _id = req.params.id;
  const body = req.body;
  try {
    const user = await User.findByIdAndUpdate(_id, body, {
      new: true,
      runValidators: true,
    }).then((user) => {
      if (!user) {
        res.status(404).send();
      }
      res.send(user);
    });
  } catch (e) {
    res.status(500).send(e);
  }
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
