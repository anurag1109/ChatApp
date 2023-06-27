const express = require("express");
const router = express.Router();
router.use(express.json());

const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { encrypt, decrypt } = require("../helper");

const jwt = require("jsonwebtoken");

const { usersmodel } = require("../models/Model");
const { sendEmail } = require("../helper");

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  console.log(username);
  //checking if user already exist?
  try {
    if (await usersmodel.findOne({ email: email })) {
      res.status(401).send({ message: "User already registered" });
    } else {
      const hashpassword = await bcrypt.hash(password, 15);
      const hasheduser = new usersmodel({
        username,
        email,
        password: hashpassword,
      });
      await hasheduser.save();

      const encryptedemail = encrypt(email);

      await sendEmail(email, encryptedemail);
      res.status(200).send({ message: "user has been added successfully" });
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
});
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const isUserExist = await usersmodel.findOne({ email: email });
    if (!isUserExist) {
      res
        .status(400)
        .send({ message: "User not exist. Please Register first" });
    } else if (!(await bcrypt.compare(password, isUserExist.password))) {
      res.status(400).send({ message: "Password is not correct" });
    } else if (isUserExist.status !== "Active") {
      res.status(400).send({ message: "Email not verified" });
    } else {
      const token = jwt.sign(
        {
          userID: isUserExist._id,
        },
        "userkey"
      );
      res.status(200).send({ username: isUserExist.username, token: token });
    }
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post("/verification", async (req, res) => {
  const { myParam } = req.body;
  const decryptedEmail = decrypt(myParam);

  try {
    const isUserExist = await usersmodel.findOne({ email: decryptedEmail });
    if (!isUserExist) {
      res.status(400).send({ Alert: "Not a valid User " });
    }

    const filter = { email: decryptedEmail };
    const update = {
      username: isUserExist.username,
      email: isUserExist.email,
      password: isUserExist.password,
      status: "Active",
    };

    await usersmodel
      .findOneAndUpdate(filter, update, { new: true })
      .then((updatedUser) => {
        if (updatedUser) {
          res.status(200).send({ message: "Verification successfull" });
        } else {
          res.status(400).send({ message: "Verification failed" });
        }
      });
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
