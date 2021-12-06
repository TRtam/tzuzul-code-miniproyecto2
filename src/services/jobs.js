//
const model = require("../models/jobs/index.js");

module.exports = {
    getAll: async (options = {}) => {
        try {
            return await model.find(options).exec();
        }
        catch(error) {
            return [];
        }
    },

    get: async (options = {}) => {
        try {
            return await model.findOne(options).exec();
        }
        catch(error) {
            return false;
        }
    },

    getById: async (id) => {
        try {
            return await model.findById(id).exec();
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