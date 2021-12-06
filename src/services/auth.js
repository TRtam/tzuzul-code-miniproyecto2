//
const bcrypt = require("bcryptjs");

//
const jwt = require("jsonwebtoken");

//
const el = require("email-validator");

//
const config = require("../config/index.js");

//
const users = require("./users.js");

//
module.exports = {
    login: async (details) => {
        if(!(details && details.username && details.password)) {
            return {success: false, message: "invalid details"};
        }

        const user = await users.get({username: details.username}, true);

        if(!user) {
            return {success: false, message: "invalid username"};   
        }

        if(!(await bcrypt.compare(details.password, user.password))) {
            return {success: false, message: "invalid password"};
        }

        const token = jwt.sign({userId: user._id, userRole: user.role}, config.jwt.secretKey, {expiresIn: "1d"});

        return {success: true, message: "successfully logged in", token: token};
    },

    register: async (details) => {
        if(!(details && details.firstName && details.lastName && details.email && details.username && details.password)) {
            return {success: false, message: "invalid details"};
        }

        if(details.firstName.length < 1) {
            return {success: false, error: "first name can't be empty"};
        }

        if(details.lastName.length < 1) {
            return {success: false, error: "last name can't be empty"};
        }

        if(!el.validate(details.email)) {
            return {success: false, error: "email isn't valid"};
        }

        if((details.username < 4) || (details.username > 16)) {
            return {success: false, error: "username must have between 4 and 16 characters"};
        }

        if((details.password < 4) || (details.password > 32)) {
            return {success: false, error: "password must have between 4 and 32 characters"};
        }

        const user = await users.get({$or: [{email: details.email}, {username: details.username}]});

        if(user) {
            return {success: false, error: `${(user.email === details.email) ? "email" : "username"} is already taken`};
        }

        try {
            details.password = await bcrypt.hash(details.password, 16);
        }
        catch(error) {
            return {success: false, error: "failed to hash password, try again later"};
        }

        const newUser = await users.create(details);

        newUser.save();

        return {success: true, message: "successfully signed up"};
    },

    verify: async (token) => {
        try {
            return jwt.verify(token, config.jwt.secretKey);
        }
        catch(error) {
            return false;
        }
    }
}