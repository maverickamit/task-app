const express = require("express");
const router = new express.Router();
const User = require("../models/user");
const Task = require("../models/task");
const auth = require("../middleware/auth");
const { findOne } = require("../models/task");

//Creating Tasks endpoint
router.post("/tasks", auth, (req, res) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id,
  });

  task
    .save()
    .then((result) => {
      res.status(201).send(task);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

// Reading Task Endpoint
//Getting a list of all Tasks

router.get("/tasks", auth, async (req, res) => {
  try {
    await req.user.populate("tasks").execPopulate();
    if (!req.user.tasks) {
      return res.status(404).send();
    }
    res.send(req.user.tasks);
  } catch (e) {
    res.status(500).send();
  }
});

//Getting particular task details

router.get("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;

  try {
    const task = await Task.findOne({
      _id,
      owner: req.user._id,
    });

    if (!task) {
      return res.status(404).send();
    }

    res.send(task);
  } catch (e) {
    res.status(500).send();
  }
});

//Updating Task details

router.patch("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;
  const body = req.body;
  const allowedUpdates = ["description", "completed"];
  const updatesUsed = Object.keys(body);
  const isValidOperation = updatesUsed.every((update) => {
    return allowedUpdates.includes(update);
  });
  if (!isValidOperation) {
    res.status(400).send({
      error: "Invalid updates!",
    });
  }
  try {
    const task = await Task.findOne({
      _id,
      owner: req.user._id,
    });

    if (!task) {
      res.status(404).send();
    }

    updatesUsed.forEach((update) => {
      task[update] = body[update];
    });
    await task.save();
    res.send(task);
  } catch (e) {
    res.status(500).send(e);
  }
});

//Deleting Task

router.delete("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;

  try {
    const task = await Task.findOneAndDelete({ _id, owner: req.user._id });
    if (!task) {
      res.status(404).send();
    }
    res.send(task);
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;
