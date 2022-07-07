const express = require("express");
const app = express();
const { engine } = require("express-handlebars");
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
const middleware = require("./middleware.js");

app.engine("handlebars", engine());

app.use(cookieParser());

app.set("view engine", "handlebars");

app.use(express.static("./public"));

app.use(express.urlencoded({ extended: false }));

app.use(
    cookieSession({
        secret: `I'm always angry.`,
        maxAge: 1000 * 60 * 60 * 24,
        sameSite: true,
    })
);

app.use(function (req, res, next) {
    res.setHeader("x-frame-options", "deny");
    next();
});

app.use(require("./routers/loggedOut.js"));
app.use(require("./routers/account.js"));
app.use(require("./routers/signaturesLists.js"));
app.use(require("./routers/petitions.js"));

app.get("/", middleware.checkLogout, (req, res) => res.redirect("/register"));

app.get("*", middleware.checkLogout, (req, res) => res.redirect("/register"));

app.listen(process.env.PORT || 8080, () => {
    console.log("Listening for petition...");
});
