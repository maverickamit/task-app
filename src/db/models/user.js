const mongoose = require("mongoose");
const validator = require("validator");
const userSchema = new mongoose.Schema({
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

userSchema.pre("save", async function (next) {
  const user = this;

  next();
});

const User = mongoose.model("User", userSchema);

// const newUser = new User({
//   name: "Amit",
//   email: "mike@aol.com",
//   password: "password123",
// });

// newUser
//   .save()
//   .then((result) => {
//     console.log(newUser);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

module.exports = User;
