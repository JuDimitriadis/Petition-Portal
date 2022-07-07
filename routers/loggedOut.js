const express = require("express");
const router = express.Router();
const middleware = require("../middleware.js");
const database = require("../database/database");

router.get("/register", middleware.checkLogout, (req, res) => {
    res.render("register", {
        tittle: "Karen's Petition Portal",
        customstyle: '<link rel="stylesheet" href="/style.css">',
    });
});

router.post("/register", (req, res) => {
    const { firstName, lastName, eMail, password } = req.body;
    if (!firstName || !lastName || !eMail || !password) {
        res.render("register", {
            error: "Ops, somenthing went wrong! Please check your data and try again.",
            tittle: "Karen's Petition Portal",
            customstyle: '<link rel="stylesheet" href="/style.css">',
        });
    }
    database
        .newUser(req.body)
        .then((new_user) => {
            const newId = { id: new_user.id };
            req.session = newId;
            res.redirect("/profile");
        })
        .catch((error) => {
            console.log("new user error", error);
            if (error.constraint === "users_email_key") {
                res.render("register", {
                    error: "Ops, somenthing went wrong! E-mail already registered",
                    tittle: "Karen's Petition Portal",
                    customstyle: '<link rel="stylesheet" href="/style.css">',
                    firstName: firstName,
                    lastName: lastName,
                    eMail: eMail,
                });
                return;
            }
            res.render("register", {
                error: "Ops, somenthing went wrong! Please check your data",
                tittle: "Karen's Petition Portal",
                customstyle: '<link rel="stylesheet" href="/style.css">',
                firstName: firstName,
                lastName: lastName,
                eMail: eMail,
            });
            return;
        })
        .catch((error) => {
            console.log("ERROR POST /register: ", error);
            res.redirect("/");
        });
});

router.get("/login", middleware.checkLogout, (req, res) => {
    res.render("login", {
        tittle: "Karen's Petition Portal - Login",
        customstyle: '<link rel="stylesheet" href="/style.css">',
    });
});

router.post("/login", (req, res) => {
    const { eMail, password } = req.body;
    if (!eMail || !password) {
        res.render("login", {
            error: "Ops, somenthing went wrong! Please check your data and try again.",
            tittle: "Karen's Petition Portal - Login",
            customstyle: '<link rel="stylesheet" href="/style.css">',
        });
    }

    database
        .authLogin(eMail, password)
        .then((result) => {
            if (result === null) {
                res.render("login", {
                    error: "Ops, somenthing went wrong! E-mail and/or password incorrect",
                    tittle: "Karen's Petition Portal - Login",
                    customstyle: '<link rel="stylesheet" href="/style.css">',
                });
                return;
            }
            const loginId = { id: result.id };
            req.session = loginId;
            database.getProfileById(result.id).then((result) => {
                if (result === null) {
                    return res.redirect("/profile");
                } else {
                    res.redirect("/petitions");
                }
            });
        })
        .catch((error) => {
            console.log("Error post/login ", error);
            res.render("login", {
                error: "Ops, somenthing went wrong! Please try again",
                tittle: "Karen's Petition Portal - Login",
                customstyle: '<link rel="stylesheet" href="/style.css">',
            });
            return;
        });
});

router.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/login");
});

module.exports = router;
