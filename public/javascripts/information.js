const mongoose = require("mongoose");
const Shema = mongoose.Schema;

const info_schema = new Shema({
  name: { type: String, required: true, unique: true },
  email: { type: String, require: true, unique: true },
  image: { type: String, require: true, unique: true },
  cv: { type: String, require: true, unique: true },
});

const information = mongoose.model("information", info_schema);

module.exports = information;
