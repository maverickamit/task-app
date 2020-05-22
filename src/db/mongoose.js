const mongoose = require("mongoose");
const validator = require("validator");

mongoose.connect("mongodb://127.0.0.1:27017/task-app-api", {
  useNewUrlParser: true,
  useCreateIndex: true,
});

const Task = mongoose.model("Task", {
  description: { type: String, required: true },
  completed: {
    type: Boolean,
    validate(value) {
      if (value != true) {
        return false;
      }
    },
  },
});

const User = mongoose.model("User", {
  name: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is invalid");
      }
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 8,
  },
});

const newTask = new Task({
  description: "Complete your diet",
  completed: true,
  email: "mike@aol.com",
  password: "password",
});

newTask
  .save()
  .then((result) => {
    console.log(newTask);
  })
  .catch((err) => {
    console.log(err);
  });

const newUser = new User({
  name: "Amit",
  email: "mike@aol.com",
  password: "password123",
});

newUser
  .save()
  .then((result) => {
    console.log(newUser);
  })
  .catch((err) => {
    console.log(err);
  });
