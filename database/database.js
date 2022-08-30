const spicedPg = require('spiced-pg');
const bcrypt = require('bcryptjs');
let db;

if (process.env.DATABASE_URL) {
    db = spicedPg(process.env.DATABASE_URL);
} else {
    const {
        DATABASE_USER,
        DATABASE_PASSWORD,
        DATABASE_NAME,
    } = require('../secrets.json');
    db = spicedPg(
        `postgres:${DATABASE_USER}:${DATABASE_PASSWORD}@localhost:5432/${DATABASE_NAME}`
    );
}

//Function called by changePassword and newUser
//Password hashing is a one-way process of securing plain text password by creating a string
//of a fixed size called hash using cryptographic hash function.
function hashPassword(password) {
    return bcrypt.genSalt().then((salt) => {
        return bcrypt.hash(password, salt);
    });
}

//Function called by authLogin
function getUserByemail(email) {
    return db
        .query(`SELECT * FROM users WHERE email = $1`, [email])
        .then((result) => result.rows[0])
        .catch((error) => console.log('DB getUserByemail', error));
}

//function called by getThankYouData
function getUserById(id) {
    return db
        .query(`SELECT * FROM users WHERE id = $1`, [id])
        .then((result) => result.rows[0])
        .catch((error) => console.log('DB getUserById', error));
}

//function called by getThankYouData
function totalSignature(petitionName) {
    return db
        .query(`SELECT COUNT(*) FROM signatures WHERE petition_name = $1;`, [
            petitionName,
        ])
        .catch((error) => console.log('DB totalSignature', error));
}

//EXPORTED FUNCTIONS

//not in use yet. Ready for new feature "add new petition"
function newPetition({ name, tittle, image, descrip }) {
    db.query(
        `INSERT INTO petitions (name, tittle, image, description)
VALUES ($1,$2,$3, $4)
RETURNING * `,
        [name, tittle, image, descrip]
    ).catch((error) => console.log('DB newPetition', error));
}

//function called by "/api/register" POST (router: loggedOut.js)
function newUser({ firstName, lastName, eMail, password }) {
    const first = firstName.toUpperCase();
    const last = lastName.toUpperCase();
    return hashPassword(password)
        .then((hashPass) => {
            return db
                .query(
                    `INSERT INTO users (first_name, last_name, email, hash_password)
        VALUES ($1,$2,$3, $4)
        RETURNING * `,
                    [first, last, eMail, hashPass]
                )
                .catch((error) => console.log('DB newUser', error));
        })
        .then((result) => result.rows[0]);
}

//Function called by "/api/petitions/:name" POST (router:petitions.js)
function newSignature(signature, id, petitionName, petitionTittle) {
    return getSignatureByIdAndPetitionName(id, petitionName)
        .then((result) => {
            if (result) {
                const signed = { signed: 'yes' };
                return signed;
            } else {
                return db.query(
                    `INSERT INTO signatures (signature, user_ID, petition_name, petition_tittle)
                    VALUES ($1,$2, $3, $4)
                    RETURNING * `,
                    [signature, id, petitionName, petitionTittle]
                );
            }
        })
        .catch((error) => {
            console.log('ERROR new signature', error);
        });
}

//Function called by '/api/login' POST (router: loggedOut.js)
function authLogin(email, password) {
    let userLogin;
    return getUserByemail(email)
        .then((user) => {
            userLogin = user;
            if (!user) {
                return null;
            } else {
                return bcrypt.compare(password, user.hash_password);
            }
        })
        .then((result) => {
            if (result === false || result === null) {
                return null;
            } else {
                return userLogin;
            }
        });
}

//function called by "/api/my-account" POST (router: account.js)
function changePassword(newpassword, id) {
    return hashPassword(newpassword)
        .then((hashPass) => {
            db.query(
                `UPDATE users SET hash_password = $1 WHERE id = $2
            RETURNING * `,
                [hashPass, id]
            );
        })
        .catch((error) => console.log('DB changePassword', error));
}

//function called by "/api/my-account" POST (router: account.js)
function updateProfile(age, city, homepage, managers, id) {
    let newAge = age || null;
    let newCity = city.toUpperCase() || null;
    let newHomepage = homepage || null;
    let newManagers = managers || null;

    return db
        .query(
            `INSERT INTO profiles (age, city, homepage, managers,user_ID)
    VALUES ($1, $2, $3, $4, $5)
    ON CONFLICT (user_id)
    DO UPDATE SET age = $1, city = $2, homepage = $3, managers = $4
    RETURNING * `,
            [newAge, newCity, newHomepage, newManagers, id]
        )
        .then((result) => {
            return result.rows[0];
        })
        .catch((error) => console.log('DB updateProfile', error));
}

//function called by "/api/my-account" POST (router: account.js)
function updateUsers(firstName, lastName, eMail, id) {
    const newFirst = firstName.toUpperCase();
    const newLast = lastName.toUpperCase();
    return db
        .query(
            `UPDATE users SET first_name = $1, last_name = $2, email = $3 WHERE id = $4
        RETURNING * `,
            [newFirst, newLast, eMail, id]
        )
        .then((result) => {
            return result.rows[0];
        })
        .catch((error) => console.log('DB UpdateUsers ERROR', error));
}

//Function called by "/api/my-signatures" POST (router: account.js)
function deleteSignature(petitionName, id) {
    return db
        .query(
            `DELETE FROM signatures 
    WHERE user_ID = $1 AND petition_name = $2;`,
            [id, petitionName]
        )
        .then((result) => {
            return result;
        })
        .catch((error) => console.log('DB deleteSignature ERROR', error));
}

//Function called by "/api/thank-you/:name" GET (router: petitions.js)
function getThankYouData(id, petitionName) {
    let data = {};
    return getSignatureByIdAndPetitionName(id, petitionName)
        .then((result) => {
            if (!result) {
                return null;
            } else {
                data.signature = result.signature;
                return getUserById(id);
            }
        })
        .then((user) => {
            if (user === null) {
                return null;
            } else {
                data.firstName = user.first_name;
                return totalSignature(petitionName);
            }
        })
        .then((count) => {
            data.count = count.rows[0].count;
            return getPetitions(petitionName);
        })
        .then((petition) => {
            data.petitionTittle = petition[0].tittle;
            return data;
        })
        .catch((error) => console.log(' DB getThankYouData error', error));
}

//Function called by "/api/my-signatures" GET (router: account.js)
function getSignaturesById(id) {
    return db
        .query(
            `SELECT * FROM signatures
    WHERE user_id =$1`,
            [id]
        )
        .then((result) => {
            return result.rows;
        })
        .catch((error) => console.log(' DB getSignaturesById error', error));
}

//Function called by "/api/petitions/:name" GET, "/api/petitions" GET and "/api/petitions/:name" POST (router: petitions.js)
function getPetitions(name) {
    if (!name) {
        return db
            .query(`SELECT * FROM petitions`)
            .then((result) => {
                return result.rows;
            })
            .catch((error) => console.log('DB getPetitions IF ERROR: ', error));
    } else {
        return db
            .query(
                `SELECT * FROM petitions 
        WHERE name = $1`,
                [name]
            )
            .then((result) => {
                return result.rows;
            })
            .catch((error) =>
                console.log('DB getPetitions ELSE ERROR: ', error)
            );
    }
}

//function called by "/api/signers/:name" GET (router: signatureList.js)
function getSignersByPetition(petitionName) {
    return db
        .query(
            `SELECT users.first_name, users.last_name, profiles.age, profiles.homepage, profiles.city, signatures.id, signatures.user_ID,  signatures.petition_name, signatures.petition_tittle
            FROM users
            FULL OUTER JOIN profiles
            ON users.id = profiles.user_ID
            JOIN signatures   
            ON users.id = signatures.user_ID
            WHERE petition_name = $1`,
            [petitionName]
        )
        .then((result) => {
            return result.rows;
        })
        .catch((error) =>
            console.log('DB getSignersByPetition ERROR: ', error)
        );
}

//function called by '/api/signers/:name/:id' GET (router: signaturesList.js)
function getSignersByCity(city, petitionName) {
    return db
        .query(
            `SELECT users.first_name, users.last_name, profiles.age, profiles.homepage, profiles.city, signatures.id, signatures.user_ID,  signatures.petition_name, signatures.petition_tittle
            FROM users
            FULL OUTER JOIN profiles
            ON users.id = profiles.user_ID
            JOIN signatures   
            ON users.id = signatures.user_ID
            WHERE profiles.city = $1 AND  petition_name = $2`,
            [city, petitionName]
        )
        .then((result) => {
            return result.rows;
        })
        .catch((error) => console.log('DB getSignersByCity ERROR: ', error));
}

//Function called by '/api/signers/:name' GET, '/api/signers/:name/:id' GET (router: signaturesList.js),
// newSignature and getThankYouData
function getSignatureByIdAndPetitionName(id, petitionName) {
    return db
        .query(
            `SELECT * FROM signatures WHERE user_ID = $1 AND petition_name = $2`,
            [id, petitionName]
        )
        .then((result) => result.rows[0])
        .catch((error) =>
            console.log('DB getSignatureByIdAndPetitionName ERROR: ', error)
        );
}

//Function called by "/api/my-account" GET, POST
function getUserAndProfileByID(id) {
    return db
        .query(
            `SELECT users.first_name, users.last_name, users.email, profiles.age, profiles.city, profiles.homepage, profiles.managers
            FROM users
            FULL OUTER JOIN profiles
            ON users.id = profiles.user_ID
            WHERE users.id = $1`,
            [id]
        )
        .then((result) => {
            return result.rows[0];
        })
        .catch((error) =>
            console.log('DB getUserAndProfileByID ERROR: ', error)
        );
}

// function getProfileById(id) {
//     return db
//         .query(`SELECT * FROM profiles WHERE user_ID = $1`, [id])
//         .then((result) => {
//             if (result.rowCount === 0) {
//                 return null;
//             } else {
//                 return result.rows[0];
//             }
//         })
//         .catch((error) => console.log('DB getProfileById ERROR: ', error));
// }

module.exports = {
    newPetition,
    newUser,
    newSignature,
    authLogin,
    changePassword,
    updateProfile,
    updateUsers,
    deleteSignature,
    getThankYouData,
    getSignaturesById,
    getPetitions,
    getSignersByPetition,
    getSignersByCity,
    getSignatureByIdAndPetitionName,
    getUserAndProfileByID,
};
