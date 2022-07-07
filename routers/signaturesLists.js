const express = require("express");
const router = express.Router();
const middleware = require("../middleware.js");
const database = require("../database/database");

router.get("/signers/:name", middleware.checkLogin, (req, res) => {
    database
        .getSignatureByIdAndPetitionName(req.session.id, req.params.name)
        .then((result) => {
            if (!result) {
                return res.redirect(`petitions/${req.params.name}`);
            }
            return database
                .getSignersByPetition(req.params.name)
                .then((signers) => {
                    res.render("signers", {
                        tittle: "Karen's Petition Portal",
                        customstyle:
                            '<link rel="stylesheet" href="/style.css">',
                        signers: signers,
                        petition_tittle: signers[0].petition_tittle,
                    });
                })
                .catch((error) => {
                    console.log("error get signers", error);
                    res.redirect("/petitions");
                });
        })
        .catch((error) => {
            console.log("error get signers", error);
            res.redirect("/petitions");
        });
});

router.get("/signers/:name/:id", (req, res) => {
    database
        .getSignatureByIdAndPetitionName(req.session.id, req.params.name)
        .then((result) => {
            if (!result) {
                return res.redirect(`petitions/${req.params.name}`);
            }
            return database
                .getSignersBtCity(req.params.id, req.params.name)
                .then((signers) => {
                    res.render("signersByCity", {
                        tittle: "Karen's Petition Portal",
                        customstyle:
                            '<link rel="stylesheet" href="/style.css">',
                        signers: signers,
                        city: req.params.id,
                        petition_tittle: signers[0].petition_tittle,
                    });
                })
                .catch((error) => {
                    console.log("error get signers by city", error);
                    res.redirect("/petitions");
                });
        })
        .catch((error) => {
            console.log("error get signers by city", error);
            res.redirect("/petitions");
        });
});

module.exports = router;
