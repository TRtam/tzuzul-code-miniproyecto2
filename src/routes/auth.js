//
const {Router} = require("express");

//
const auth = require("../services/auth.js");

//
const route = Router();

//
route.post("/login", async (req, res) => {
    //
    const cookies = req.cookies;

    if(cookies && cookies.login) {
        const token = await auth.verify(cookies.login || "");

        if(token) {
            return res.status(200).json({success: true, message: "already logged in"});
        }
    }

    //
    const details = req.body || {};

    const result = await auth.login(details);

    if(result.success) {
        res.cookie("login", result.token, {httpOnly: true, secure: false});
    }

    return res.status(result.success ? 200 : 400).json({success: result.success, message: result.message});
});

//
route.post("/logout", (req, res) => {
    const cookies = req.cookies;

    if(cookies && cookies.login) {
        const token = auth.verify(cookies.login || "");

        if(token) {
            return res.clearCookie("login").status(200).json({success: true, message: "successfully logged out"});
        }
    }

    return res.status(400).json({success: false, message: "not logged in"});
});

//
route.post("/register-client", async (req, res) => {
    const details = req.body || {};

    //
    details.role = "client";

    const result = await auth.register(details);

    res.status(result.success ? 200 : 400).json(result);
});

//
route.post("/register-employer", async (req, res) => {
    const details = req.body || {};

    //
    details.role = "employer";

    const result = await auth.register(details);

    res.status(result.success ? 200 : 400).json(result);
});

//
route.post("/register-admin", async (req, res) => {
    const details = req.body || {};

    //
    details.role = "admin";

    const result = await auth.register(details);

    res.status(result.success ? 200 : 400).json(result);
});

//
module.exports = server => {
    server.use("/auth", route);
}