const express = require("express");
const router = new express.Router();
const multer = require("multer");
const sharp = require("sharp");
const User = require("../models/user");
const auth = require("../middleware/auth");
const { sendWelcomeEmail, sendCancelationEmail } = require("../emails/account");

//Creating Users endpoint
router.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
    const token = await user.generateAuthToken();
    await user.save();
    sendWelcomeEmail(user.email, user.name);
    res.status(201).send({
      user,
      token,
    });
  } catch (err) {
    res.status(400).send(err);
  }
});

//Endpoint for uploading profile picture

const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    // cb(new Error("File must be an image"));
    // cb(undefined, true);
    // cb(undefined, false);
    if (!file.originalname.match(/\.(jpeg|jpg|png)$/)) {
      cb(new Error("File must be an image only"));
    }
    cb(undefined, true);
  },
});

router.post(
  "/users/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();
    req.user.avatar = buffer;

    await req.user.save();
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

//Endpoint for deleting profile picture

router.delete("/users/me/avatar", auth, async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();
  res.send();
});

//Endpoint for getting an url for the avatar

router.get("/users/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || !user.avatar) {
      throw new Error();
    }
    res.set("Content-Type", "png");
    res.send(user.avatar);
  } catch (e) {
    res.status(404).send();
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
    res.status(200).send({
      user,
      token,
    });
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

// router.get("/users/:id", (req, res) => {
//   const _id = req.params.id;
//   User.findById(_id)
//     .then((user) => {
//       if (!user) {
//         res.status(404).send();
//       }
//       res.send(user);
//     })
//     .catch((e) => {
//       res.status(500).send();
//     });
// });

//Updating User details

router.patch("/users/me", auth, async (req, res) => {
  // const _id = req.user._id;
  const body = req.body;
  const allowedUpdates = ["name", "email", "password"];
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
    // const user = await User.findByIdAndUpdate(_id, body, {
    //   new: true,
    //   runValidators: true,
    // });
    const user = req.user;
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

router.delete("/users/me", auth, async (req, res) => {
  // const _id = req.user._id;

  try {
    await req.user.remove();
    sendCancelationEmail(req.user.email, req.user.name);
    res.send(req.user);
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;
