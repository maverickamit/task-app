const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/task-app-api", {
  useNewUrlParser: true,
  useCreateIndex: true,
});

const Task = mongoose.model("Task", {
  description: { type: String },
  completed: { type: Boolean },
});

const newtask = new Task({
  description: "Take a walk outside",
  completed: true,
});

newtask
  .save()
  .then((result) => {
    console.log(newtask);
  })
  .catch((err) => {
    console.log(err);
  });
