// import and execute dotenv
require("dotenv").config();

// export .env variables
module.exports = {
    server: {
        port: parseInt(process.env.SERVER_PORT) || 80
    },
    db: {
        uri: process.env.DB_URI || ""
    },
    jwt: {
        secretKey: process.env.JWT_SECRET_KEY || "123456"
    }
}