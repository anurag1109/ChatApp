const mongoose = require("mongoose");
const usersschema = mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    status: { type: String, default: "inActive" },
  },
  {
    strict: false,
  }
);

const usersmodel = mongoose.model("users", usersschema);
module.exports = {
  usersmodel,
};
