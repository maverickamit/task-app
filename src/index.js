const express = require("express");
const port = process.env.PORT || 3001;
require("./db/mongoose");
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");
const app = express();

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

//Serving the app on port 3000
app.listen(port, () => {
  console.log("server is up on port " + port);
});
