const express = require("express");
const bcrypt = require("bcryptjs");

const port = process.env.PORT || 3001;
require("./db/mongoose");
const User = require("./db/models/user");
const Task = require("./db/models/task");
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");
const app = express();

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

//Hashing Password

// const hashing = async () => {
//   const Password = "1234522";
//   const hashedPassword = await bcrypt.hash(Password, 8);
//   console.log(Password, hashedPassword);
//   const isMatch = await bcrypt.compare(Password, hashedPassword);
//   console.log(isMatch);
// };
// hashing();

//Serving the app on port 3000
app.listen(port, () => {
  console.log("server is up on port " + port);
});
