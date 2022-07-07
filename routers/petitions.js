const express = require("express");
const router = express.Router();
const middleware = require("../middleware.js");
const database = require("../database/database");

router.get("/petitions", middleware.checkLogin, (req, res) => {
    database.getPetitions().then((result) => {
        res.render("petitionsList", {
            tittle: "Karen's Petition Portal",
            customstyle: '<link rel="stylesheet" href="/style.css">',
            script: '<script src="/script.js"></script>',
            petitions: result,
        });
    });
});

router.get("/petitions/:name", middleware.checkLogin, (req, res) => {
    database
        .getPetitions(req.params.name)
        .then((result) => {
            res.render("newPetition", {
                tittle: "Karen's Petition Portal - Sign here",
                customstyle: '<link rel="stylesheet" href="/style.css">',
                script: '<script src="/script.js"></script>',
                petitionTittle: result[0].tittle,
                description: result[0].description,
                image: result[0].image,
            });
        })
        .catch((error) => {
            console.log("ERRO GET /petition:name", error);
            return res.redirect("/petitions");
        });
});

router.post("/petitions/:name", middleware.checkLogin, (req, res) => {
    let petition;

    database
        .getPetitions(req.params.name)
        .then((results) => {
            petition = results;
            if (req.body.signature === "") {
                return null;
            }
            return database.newSignature(
                req.body.signature,
                req.session.id,
                req.params.name,
                petition[0].tittle
            );
        })
        .then((result) => {
            if (!result) {
                res.render("newPetition", {
                    error: "Please sign before continue",
                    tittle: "Karen's Petition Portal - Sign here",
                    customstyle: '<link rel="stylesheet" href="/style.css">',
                    script: '<script src="/script.js"></script>',
                    petitionTittle: petition[0].tittle,
                    description: petition[0].description,
                    image: petition[0].image,
                });
                return;
            }
            if (result.signed === "yes") {
                res.render("newPetition", {
                    error: "Ops, looks like you have already signed this petition",
                    tittle: "Karen's Petition Portal - Sign here",
                    customstyle: '<link rel="stylesheet" href="/style.css">',
                    script: '<script src="/script.js"></script>',
                    petitionTittle: petition[0].tittle,
                    description: petition[0].description,
                    image: petition[0].image,
                });
                return;
            }
            res.redirect(`/thank-you/${req.params.name}`);
        })
        .catch((error) => {
            console.log("Get Petition/:name ERROR", error);
            return res.redirect("/petitions");
        });
});

router.get("/thank-you/:name", middleware.checkLogin, (req, res) => {
    database
        .getThankYouData(req.session.id, req.params.name)
        .then((result) => {
            if (result === null) {
                res.redirect(`/petitions/${req.params.name}`);
            }
            res.render("thank-you", {
                tittle: "Karen's Petition Portal - Thank You!",
                customstyle: '<link rel="stylesheet" href="/style.css">',
                name: result.firstName,
                signature: result.signature,
                count: result.count,
                petitionTittle: result.petitionTittle,
                petitionName: req.params.name,
            });
        })
        .catch((error) => {
            console.log("Get Thank you error", error);
            res.redirect(`/petitions/${req.params.name}`);
        });
});

module.exports = router;
