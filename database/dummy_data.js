const db = require("/Users/jupazin/aspartame-petition/database/database.js");

// db.newUser({
//     firstName: "carol",
//     lastName: "Jones",
//     eMail: "Jones@carol.com",
//     password: "carol",
// });
// db.newUser({
//     firstName: "madaline",
//     lastName: "Smith",
//     eMail: "Smith@madaline.com",
//     password: "madaline",
// });
// db.newUser({
//     firstName: "Abigail",
//     lastName: "White",
//     eMail: "White@Abigail.com",
//     password: "Abigail",
// });
// db.newUser({
//     firstName: "Bernadette",
//     lastName: "King",
//     eMail: "King@Bernadette.com",
//     password: "Bernadette",
// });
// db.newUser({
//     firstName: "Betsy",
//     lastName: "Davies",
//     eMail: "Davies@Betsy.com",
//     password: "Betsy",
// });
// db.newUser({
//     firstName: "Dora",
//     lastName: "Johnson",
//     eMail: "Johnson@Dora.com",
//     password: "Dora",
// });
// db.newUser({
//     firstName: "Edith",
//     lastName: "Green",
//     eMail: "Green@Edith.com",
//     password: "Edith",
// });
// db.newUser({
//     firstName: "Helen",
//     lastName: "Roberts",
//     eMail: "Roberts@Helen.com",
//     password: "Helen",
// });
// db.newUser({
//     firstName: "Irene",
//     lastName: "Clarke",
//     eMail: "Clarke@Irene.com",
//     password: "Irene",
// });
// db.newUser({
//     firstName: "Loretta",
//     lastName: "White",
//     eMail: "White@Loretta.com",
//     password: "Loretta",
// });
// db.newUser({
//     firstName: "Margaret",
//     lastName: "Turner",
//     eMail: "Turner@Margaret.com",
//     password: "Margaret",
// });
// db.newUser({
//     firstName: "Nora",
//     lastName: "Thompson",
//     eMail: "Thompson@Nora.com",
//     password: "Nora",
// });
// db.newUser({
//     firstName: "Roxanne",
//     lastName: "Phillips",
//     eMail: "Phillips@Roxanne.com",
//     password: "Roxanne",
// });
// db.newUser({
//     firstName: "Trudy",
//     lastName: "Carter",
//     eMail: "Carter@Trudy.com",
//     password: "Trudy",
// });
// db.newUser({
//     firstName: "Nancy",
//     lastName: "Parker",
//     eMail: "Parker@Nancy.com",
//     password: "Nancy",
// });
// db.newUser({
//     firstName: "Wanda",
//     lastName: "Lee",
//     eMail: "Lee@Wanda.com",
//     password: "Wanda",
// });

// db.newProfile(
//     {
//         age: 35,
//         city: "cleveland",
//         homepage: "https://www.google.com/cleveland",
//         managers: 20,
//     },
//     10
// );
// db.newProfile(
//     {
//         age: "",
//         city: "madison",
//         homepage: "https://www.google.com/madison",
//         managers: 12,
//     },
//     4
// );
// db.newProfile({ age: 78, city: "dallas", homepage: "", managers: "" }, 3);
// db.newProfile(
//     {
//         age: 45,
//         city: "Pasadena",
//         homepage: "https://www.google.com/Pasadena",
//         managers: "",
//     },
//     2
// );
// db.newProfile(
//     {
//         age: "",
//         city: "dallas",
//         homepage: "https://www.google.com/dallas",
//         managers: 23,
//     },
//     1
// );
// db.newProfile(
//     {
//         age: 41,
//         city: "madison",
//         homepage: "https://www.google.com/madison",
//         managers: 5,
//     },
//     5
// );
// db.newProfile({ age: 38, city: "Pasadena", homepage: "", managers: 9 }, 9);
// db.newProfile(
//     {
//         age: 67,
//         city: "cleveland",
//         homepage: "https://www.google.com/cleveland",
//         managers: 33,
//     },
//     11
// );
// db.newProfile(
//     { age: 45, city: "", homepage: "https://www.google.com/", managers: 18 },
//     13
// );
// db.newProfile(
//     {
//         age: 90,
//         city: "Pasadena",
//         homepage: "https://www.google.com/Pasadena",
//         managers: 45,
//     },
//     12
// );
// db.newProfile({ age: 47, city: "cleveland", homepage: "", managers: 8 }, 15);
// db.newProfile(
//     {
//         age: 60,
//         city: "cleveland",
//         homepage: "https://www.google.com/cleveland",
//         managers: 10,
//     },
//     16
// );
// db.newProfile({ age: 51, city: "madison", homepage: "", managers: "" }, 14);
// db.newProfile(
//     { age: "", city: "", homepage: "https://www.google.com/", managers: 5 },
//     8
// );
// db.newProfile(
//     {
//         age: 64,
//         city: "dallas",
//         homepage: "https://www.google.com/dallas",
//         managers: 1,
//     },
//     7
// );
// db.newProfile(
//     {
//         age: 54,
//         city: "madison",
//         homepage: "https://www.google.com/madison",
//         managers: 3,
//     },
//     6
// );

const spicedPg = require("spiced-pg");
const db2 = spicedPg("postgres:postgres:postgres@localhost:5432/petition");

function newPetition({ name, tittle, image, descrip }) {
    db2.query(
        `INSERT INTO petitions (name, tittle, image, description)
VALUES ($1,$2,$3, $4)
RETURNING * `,
        [name, tittle, image, descrip]
    ).catch((error) => console.log(error));
}

newPetition({
    name: "no_selfie",
    tittle: "Let's make selfie illegal",
    image: "/noSelfie.png",
    descrip:
        "We must end the selfie culture where all the happy people are constantly taking selfies of happy moments and posting them on social media. This is ruining our children's future, and we must stop it as soon as possible.",
});

newPetition({
    name: "mail",
    tittle: "Let's make it legal to poke around our neighbors' mail.",
    image: "/mail.png",
    descrip:
        "It is completely to just see our happy neighbors from afar, receiving several packages and envelopes daily, we must supervise and ensure that our happy and hardworking neighbors are not using the post services for anything illegal.  That's why we must immediately ensure that every good citizen are allowed to poke around theirs neighbors mailbox and packages.",
});
// app.get("/petition", (req, res) => {
//     if (!req.session.id) {
//         res.render("login", {
//             error: "Please login before sign",
//             tittle: "Karen's Petition Portal - Login",
//             customstyle: '<link rel="stylesheet" href="/style.css">',
//         });
//         return;
//     }
//     res.render("petition", {
//         tittle: "Karen's Petition Portal - Sign here",
//         customstyle: '<link rel="stylesheet" href="/style.css">',
//         script: '<script src="/script.js"></script>',
//     });
// });

// app.post("/petition", (req, res) => {
//     if (!req.session.id) {
//         res.render("login", {
//             error: "Please login before sign",
//             tittle: "Karen's Petition Portal - Login",
//             customstyle: '<link rel="stylesheet" href="/style.css">',
//         });
//         return;
//     }
//     if (req.body.signature === "") {
//         res.render("petition", {
//             error: "Please sign before continue",
//             tittle: "Karen's Petition Portal - Sign here",
//             customstyle: '<link rel="stylesheet" href="/style.css">',
//             script: '<script src="/script.js"></script>',
//         });
//     } else {
//         database
//             .newSignature(req.body, req.session.id)
//             .then((result) => {
//                 if (result === null) {
//                     res.render("login", {
//                         error: "Ops, something went wrong! Please login again before sign",
//                         tittle: "Karen's Petition Portal - Login",
//                         customstyle:
//                             '<link rel="stylesheet" href="/style.css">',
//                     });
//                     return;
//                 }
//                 if (result.signed === "yes") {
//                     res.render("petition", {
//                         error: "Ops, looks like you have already signed this petition",
//                         tittle: "Karen's Petition Portal - Sign here",
//                         customstyle:
//                             '<link rel="stylesheet" href="/style.css">',
//                         script: '<script src="/script.js"></script>',
//                     });
//                     return;
//                 }
//                 res.redirect("/thank-you");
//             })
//             .catch((error) => console.log("petition post error", error));
//     }
// });
