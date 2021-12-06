//
const model = require("../models/users/index.js");

module.exports = {
    getAll: async (options = {}, password = false) => {
        try {
            return await model.find(options).select(password ? "+password" : "-password").exec();
        }
        catch(error) {
            return [];
        }
    },

    get: async (options = {}, password = false) => {
        try {
            return await model.findOne(options).select(password ? "+password" : "-password").exec();
        }
        catch(error) {
            return false;
        }
    },

    getById: async (id, password = false) => {
        try {
            return await model.findById(id).select(password ? "+password" : "-password").exec();
        }
        catch(error) {
            return false;
        }
    },

    create: async (details) => {
        try {
            return await model.create(details);
        }
        catch(error) {
            return false;
        }
    },

    update: async (id, details) => {
        try {
            await model.findByIdAndUpdate(id, details).exec();

            return true;
        }
        catch(error) {
            return false;
        }
    },

    delete: async (id) => {
        try {
            await model.findByIdAndDelete(id).exec();

            return true;
        }
        catch(error) {
            return false;
        }
    }
}