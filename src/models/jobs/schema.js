//
const {Schema} = require("mongoose");

//
module.exports = new Schema({
    createdBy: String,
    createdAt: String,
    title: String,
    description: String,
    taken: Boolean,
    takenBy: String
});