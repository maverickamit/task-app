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

//Endpoint for loggin out user from single session

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.send();
  } catch {
    res.status(500).send();
  }
});

//Endpoint for loggin out user from all sessions

router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch {
    res.status(500).send();
  }
});

// Reading User Endpoint
//Getting user profile

router.get("/users/me", auth, (req, res) => {
  res.send(req.user);
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

module.exports = router;
