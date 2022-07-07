const spicedPg = require("spiced-pg");
const bcrypt = require("bcryptjs");
let db;

if (process.env.DATABASE_URL) {
    db = spicedPg(process.env.DATABASE_URL);
} else {
    const {
        DATABASE_USER,
        DATABASE_PASSWORD,
        DATABASE_NAME,
    } = require("../secrets.json");
    db = spicedPg(
        `postgres:${DATABASE_USER}:${DATABASE_PASSWORD}@localhost:5432/${DATABASE_NAME}`
    );
    console.log(`[db] Connecting to: ${DATABASE_NAME}`);
}

function hashPassword(password) {
    return bcrypt.genSalt().then((salt) => {
        return bcrypt.hash(password, salt);
    });
}

function changePassword(newpassword, id) {
    return hashPassword(newpassword).then((hashPass) => {
        db.query(
            `UPDATE users SET hash_password = $1 WHERE id = $2
            RETURNING * `,
            [hashPass, id]
        );
    });
}

function authLogin(email, password) {
    let userLogin;
    return getUserByemail(email)
        .then((user) => {
            userLogin = user;
            if (!user) {
                console.log("USER NOT FOUND");
                return null;
            } else {
                return bcrypt.compare(password, user.hash_password);
            }
        })
        .then((result) => {
            if (result === false || result === null) {
                console.log("not match");
                return null;
            } else {
                return userLogin;
            }
        });
}

function newUser({ firstName, lastName, eMail, password }) {
    const first = firstName.toUpperCase();
    const last = lastName.toUpperCase();
    return hashPassword(password)
        .then((hashPass) => {
            return db.query(
                `INSERT INTO users (first_name, last_name, email, hash_password)
        VALUES ($1,$2,$3, $4)
        RETURNING * `,
                [first, last, eMail, hashPass]
            );
        })
        .then((result) => result.rows[0]);
}

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
        .catch((error) => console.log("UpdateUsers ERROR", error));
}

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
        });
}

function newSignature(signature, id, petitionName, petitionTittle) {
    return getSignatureByIdAndPetitionName(id, petitionName)
        .then((result) => {
            if (result) {
                const signed = { signed: "yes" };
                console.log("already signed");
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
            console.log("ERROR new signature", error);
        });
}

function deleteSignature(petitionName, id) {
    return db
        .query(
            `DELETE FROM signatures 
    WHERE user_ID = $1 AND petition_name = $2;`,
            [id, petitionName]
        )
        .then((result) => {
            return result;
        });
}

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
        .catch((error) => console.log("get thank you data error", error));
}

function getSignaturesById(id) {
    return db
        .query(
            `SELECT * FROM signatures
    WHERE user_id =$1`,
            [id]
        )
        .then((result) => {
            return result.rows;
        });
}

function getPetitions(name) {
    if (!name) {
        return db
            .query(`SELECT * FROM petitions`)
            .then((result) => {
                return result.rows;
            })
            .catch((error) => console.log("Get Petitions ERROR: ", error));
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
            .catch((error) => console.log("Get Petitions ERROR: ", error));
    }
}

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
        .catch((error) => console.log("Get Signers ERROR: ", error));
}

function getSignersBtCity(city, petitionName) {
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
        .catch((error) => console.log("Get Signers ERROR: ", error));
}

function getUserByemail(email) {
    return db
        .query(`SELECT * FROM users WHERE email = $1`, [email])
        .then((result) => result.rows[0]);
}

function getUserById(id) {
    return db
        .query(`SELECT * FROM users WHERE id = $1`, [id])
        .then((result) => result.rows[0]);
}

function getProfileById(id) {
    return db
        .query(`SELECT * FROM profiles WHERE user_ID = $1`, [id])
        .then((result) => {
            if (result.rowCount === 0) {
                return null;
            } else {
                return result.rows[0];
            }
        });
}

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
        });
}

function getSignatureByIdAndPetitionName(id, petitionName) {
    return db
        .query(
            `SELECT * FROM signatures WHERE user_ID = $1 AND petition_name = $2`,
            [id, petitionName]
        )
        .then((result) => result.rows[0]);
}

function totalSignature(petitionName) {
    return db.query(
        `SELECT COUNT(*) FROM signatures WHERE petition_name = $1;`,
        [petitionName]
    );
}

module.exports = {
    newUser,
    authLogin,
    newSignature,
    getThankYouData,
    getSignersByPetition,
    getSignatureByIdAndPetitionName,
    getSignersBtCity,
    getPetitions,
    getProfileById,
    getUserAndProfileByID,
    changePassword,
    updateProfile,
    updateUsers,
    getSignaturesById,
    deleteSignature,
};
