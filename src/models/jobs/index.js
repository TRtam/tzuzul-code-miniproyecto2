//
const {model} = require("mongoose");

//
const schema = require("./schema.js");

//
module.exports = model("jobs", schema);