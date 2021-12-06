// import config
const config = require("./index.js");

// import connect from mongoose
const {connect} = require("mongoose");

// export connect function
module.exports = async () => {
    try {
        await connect(config.db.uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log("successfully connected to the database");
    }
    catch(error) {
        console.log("error while trying to connect to the database");
    }
}