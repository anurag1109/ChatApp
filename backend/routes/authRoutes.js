const express = require("express");
const router = express.Router();
router.use(express.json());

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const { usersmodel } = require("../models/Model");

router.post("/register", async (req, res) => {
    const { username, email, password } = req.body;
    // console.log(username);
  //checking if user already exist?
  try {
    if (await usersmodel.findOne({ email: email })) {
      res.send({ Alert: "User already registered" });
    } else {
      const hashpassword = await bcrypt.hash(password, 15);
      const hasheduser = new usersmodel({
        username,
        email,
        password: hashpassword,
      });
      await hasheduser.save();
      res.send("user has been added successfully");
    }
  } catch (err) {
    res.status(400).send(err);
  }
});
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const isUserExist = await usersmodel.findOne({ email: email });
    if (!isUserExist) {
      res.send({ Alert: "User not exist. Please Register first" });
    } else if (!(await bcrypt.compare(password, isUserExist.password))) {
      res.send({ Alert: "Password is not correct" });
    } else {
      const token = jwt.sign(
        {
          userID: isUserExist._id,
        },
        "userkey",
        { expiresIn: "1h" }
      );
      res.send({ username: isUserExist.username, token: token });
    }
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
