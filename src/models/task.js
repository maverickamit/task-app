const mongoose = require("mongoose");
const validator = require("validator");

const Task = mongoose.model("Task", {
  description: { type: String, required: true, trim: true },
  completed: {
    type: Boolean,
    default: false,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

// const newTask = new Task({
//   description: "Complete your diet",
//   completed: true,
// });

// newTask
//   .save()
//   .then((result) => {
//     console.log(newTask);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

module.exports = Task;
