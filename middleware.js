function checkLogin(req, res, next) {
    if (!req.session.id) {
        res.redirect("/login");
        return;
    }
    next();
}

function checkLogout(req, res, next) {
    if (req.session.id) {
        res.redirect("/petitions");
        return;
    }
    next();
}

module.exports = {
    checkLogin,
    checkLogout,
};
