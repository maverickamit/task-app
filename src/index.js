const express = require("express");

const port = process.env.PORT || 3001;
require("./db/mongoose");
const User = require("./db/models/user");
const Task = require("./db/models/task");

const app = express();

app.use(express.json());

//Creating REST API endpoints

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

//Serving the app on port 3000
app.listen(port, () => {
  console.log("server is up on port " + port);
});
