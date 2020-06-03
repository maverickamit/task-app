const express = require("express");
const router = new express.Router();
const User = require("../models/user");
const auth = require("../middleware/auth");

//Creating Users endpoint
router.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
    const token = await user.generateAuthToken();
    await user.save();
    res.status(201).send({ user, token });
  } catch (err) {
    res.status(400).send(err);
  }
});

// Reading User Endpoint
//Getting a list of all Users

router.get("/users", auth, (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch((e) => {
      res.status(500).send();
    });
});

//Getting particular user details

router.get("/users/:id", (req, res) => {
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

//Updating User details

router.patch("/users/:id", async (req, res) => {
  const _id = req.params.id;
  const body = req.body;
  const allowedUpdates = ["name", "email", "password"];
  const updatesUsed = Object.keys(body);
  const isValidOperation = updatesUsed.every((update) => {
    return allowedUpdates.includes(update);
  });
  if (!isValidOperation) {
    res.status(400).send({ error: "Invalid updates!" });
  }
  try {
    // const user = await User.findByIdAndUpdate(_id, body, {
    //   new: true,
    //   runValidators: true,
    // });
    const user = await User.findById(_id);
    updatesUsed.forEach((update) => {
      user[update] = body[update];
    });
    await user.save();

    if (!user) {
      res.status(404).send();
    }
    res.send(user);
  } catch (e) {
    res.status(500).send(e);
  }
});

//Deleting User

router.delete("/users/:id", async (req, res) => {
  const _id = req.params.id;

  try {
    const user = await User.findByIdAndDelete(_id);
    if (!user) {
      res.status(404).send();
    }
    res.send(user);
  } catch (e) {
    res.status(500).send(e);
  }
});

//Endpoint for loggin in user

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.status(200).send({ user, token });
  } catch {
    res.status(404).send();
  }
});
module.exports = router;
