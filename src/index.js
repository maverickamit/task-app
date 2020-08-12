const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const port = process.env.PORT || 3001;
require("./db/mongoose");
const User = require("./models/user");
const Task = require("./models/task");
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");
const app = express();

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

// JSON web token

const myfunction = async () => {
  const token = jwt.sign({ _id: "abc123" }, "newprojectforme", {
    expiresIn: "7 days",
  });
  // console.log(token);
  console.log(jwt.verify(token, "newprojectforme"));
};
myfunction();

//Serving the app on port 3000
app.listen(port, () => {
  console.log("server is up on port " + port);
});
