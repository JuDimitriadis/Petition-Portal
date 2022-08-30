const express = require('express');
const router = express.Router();
const middleware = require('../middleware.js');
const database = require('../database/database');

router.get('/profile', middleware.checkLogin, (req, res) => {
    res.render('profile', {
        tittle: "Karen's Petition Portal - Profile",
        customstyle: '<link rel="stylesheet" href="/style.css">',
    });
});

router.post('/profile', middleware.checkLogin, (req, res) => {
    const { age, city, managers, homepage } = req.body;
    if (homepage) {
        if (!homepage.startsWith('http')) {
            res.render('profile', {
                error: 'Ops, invalid homepage address. Please check you data and try again',
                tittle: "Karen's Petition Portal - Profile",
                customstyle: '<link rel="stylesheet" href="/style.css">',
                age: age,
                city: city,
                homepage: homepage,
                managers: managers,
            });
            return;
        }
    }

    if (age < 18) {
        if (!homepage.startsWith('http')) {
            res.render('profile', {
                error: 'Sorry! You must be over 18 to sign this petition',
                tittle: "Karen's Petition Portal - Profile",
                customstyle: '<link rel="stylesheet" href="/style.css">',
                age: age,
                city: city,
                homepage: homepage,
                managers: managers,
            });
            return;
        }
    }

    if (managers <= 0) {
        if (!homepage.startsWith('http')) {
            res.render('profile', {
                error: 'Ops, invalid data! Please check your data and try again',
                tittle: "Karen's Petition Portal - Profile",
                customstyle: '<link rel="stylesheet" href="/style.css">',
                age: age,
                city: city,
                homepage: homepage,
                // managers: managers,
            });
            return;
        }
    }

    database
        .updateProfile(age, city, homepage, managers, req.session.id)
        .then(() => {
            return res.redirect('/petitions');
        })
        .catch((error) => {
            console.log('ERROR POST /profile', error);
            res.render('profile', {
                error: 'Ops, something went wrong! Please check your data and try again.',
                tittle: "Karen's Petition Portal - Profile",
                customstyle: '<link rel="stylesheet" href="/style.css">',
                age: age,
                city: city,
                homepage: homepage,
                manager: managers,
            });
        });
});

router.get('/my-account', middleware.checkLogin, (req, res) => {
    database
        .getUserAndProfileByID(req.session.id)
        .then((result) => {
            res.render('myAccount', {
                tittle: "Karen's Petition Portal - My Account",
                customstyle: '<link rel="stylesheet" href="/style.css">',
                data: result,
            });
        })
        .catch((error) => {
            console.log('ERROR GET /my-account: ', error);
            res.redirect('/');
        });
});

router.post('/my-account', middleware.checkLogin, (req, res) => {
    const { age, homepage, city, managers, firstName, lastName, eMail } =
        req.body;

    if (homepage) {
        if (!homepage.startsWith('http')) {
            database.getUserAndProfileByID(req.session.id).then((result) => {
                res.render('myAccount', {
                    tittle: "Karen's Petition Portal - My Account",
                    customstyle: '<link rel="stylesheet" href="/style.css">',
                    data: result,
                    edit: req.body.edit,
                    error: 'Ops, invalid homepage address. Please check you data and try again',
                });
            });
            return;
        }
    }
    if (age < 18) {
        database.getUserAndProfileByID(req.session.id).then((result) => {
            res.render('myAccount', {
                tittle: "Karen's Petition Portal - My Account",
                customstyle: '<link rel="stylesheet" href="/style.css">',
                data: result,
                edit: req.body.edit,
                error: 'Sorry! You must be over 18 to sign this petition',
            });
        });
        return;
    }
    if (managers <= 0) {
        database.getUserAndProfileByID(req.session.id).then((result) => {
            res.render('myAccount', {
                tittle: "Karen's Petition Portal - My Account",
                customstyle: '<link rel="stylesheet" href="/style.css">',
                data: result,
                edit: req.body.edit,
                error: 'Ops, invalid data! Please check your data and try again',
            });
        });
        return;
    }

    if (req.body.edit) {
        database.getUserAndProfileByID(req.session.id).then((result) => {
            res.render('myAccount', {
                tittle: "Karen's Petition Portal - My Account",
                customstyle: '<link rel="stylesheet" href="/style.css">',
                data: result,
                edit: req.body.edit,
            });
        });
        return;
    }
    if (req.body.editPassword) {
        database.getUserAndProfileByID(req.session.id).then((result) => {
            res.render('myAccount', {
                tittle: "Karen's Petition Portal - My Account",
                customstyle: '<link rel="stylesheet" href="/style.css">',
                data: result,
                editPassword: req.body.editPassword,
            });
        });
        return;
    }
    if (req.body.password) {
        database
            .changePassword(req.body.password, req.session.id)
            .then(() => {
                database
                    .getUserAndProfileByID(req.session.id)
                    .then((result) => {
                        res.render('myAccount', {
                            tittle: "Karen's Petition Portal - My Account",
                            customstyle:
                                '<link rel="stylesheet" href="/style.css">',
                            data: result,
                            passwordMsg: 'Your password has been updated.',
                        });
                    });
            })
            .catch((error) => {
                console.log('ERROR updating password: ', error);
                res.render('myAccount', {
                    tittle: "Karen's Petition Portal - My Account",
                    customstyle: '<link rel="stylesheet" href="/style.css">',
                    passwordMsg: 'Ops, something went wrong! Please try again',
                });
            });
        return;
    }

    database
        .updateProfile(age, city, homepage, managers, req.session.id)
        .then(() => {
            return database
                .updateUsers(firstName, lastName, eMail, req.session.id)
                .then(() => {
                    return database.getUserAndProfileByID(req.session.id);
                })
                .then((result) => {
                    res.render('myAccount', {
                        tittle: "Karen's Petition Portal - My Account",
                        customstyle:
                            '<link rel="stylesheet" href="/style.css">',
                        data: result,
                    });
                })
                .catch((error) => {
                    console.log('ERROR UPDATING ACCOUNT: ', error);
                    res.render('myAccount', {
                        tittle: "Karen's Petition Portal - My Account",
                        customstyle:
                            '<link rel="stylesheet" href="/style.css">',
                        error: 'Ops, something went wrong! Please, try again.',
                    });
                });
        })
        .catch((error) => {
            console.log('ERROR POST /my-account: ', error);
            res.redirect('/my-account');
        });
});

router.get('/my-signatures', middleware.checkLogin, (req, res) => {
    database
        .getSignaturesById(req.session.id)
        .then((result) => {
            res.render('mySignatures', {
                tittle: "Karen's Petition Portal - My Signatures",
                customstyle: '<link rel="stylesheet" href="/style.css">',
                signature: result,
            });
        })
        .catch((error) => {
            console.log('ERROR GET /my-account: ', error);
            res.redirect('/');
        });
});

router.post('/my-signatures', middleware.checkLogin, (req, res) => {
    database
        .deleteSignature(req.body.deletePassword, req.session.id)
        .then(() => res.redirect('/my-signatures'))
        .catch((error) => {
            console.log('ERROR DELETING SIGNATURA', error);
            res.redirect('/my-signaturas');
        });
});
module.exports = router;
