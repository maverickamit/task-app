const mongoose = require("mongoose");
const validator = require("validator");


const Task = mongoose.model("Task", {
  description: { type: String, required: true, trim: true },
  completed: {
    type: Boolean,
    default: false,
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
