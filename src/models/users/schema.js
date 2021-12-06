//
const {Schema} = require("mongoose");

//
module.exports = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    username: String,
    password: {type: String, select: false},
    role: String
});