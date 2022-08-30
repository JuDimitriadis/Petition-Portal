const db = require('/Users/jupazin/aspartame-petition/database/database.js');

db.newUser({
    firstName: 'carol',
    lastName: 'Jones',
    eMail: 'Jones@carol.com',
    password: 'carol',
});
db.newUser({
    firstName: 'madaline',
    lastName: 'Smith',
    eMail: 'Smith@madaline.com',
    password: 'madaline',
});
db.newUser({
    firstName: 'Abigail',
    lastName: 'White',
    eMail: 'White@Abigail.com',
    password: 'Abigail',
});
db.newUser({
    firstName: 'Bernadette',
    lastName: 'King',
    eMail: 'King@Bernadette.com',
    password: 'Bernadette',
});
db.newUser({
    firstName: 'Betsy',
    lastName: 'Davies',
    eMail: 'Davies@Betsy.com',
    password: 'Betsy',
});
db.newUser({
    firstName: 'Dora',
    lastName: 'Johnson',
    eMail: 'Johnson@Dora.com',
    password: 'Dora',
});
db.newUser({
    firstName: 'Edith',
    lastName: 'Green',
    eMail: 'Green@Edith.com',
    password: 'Edith',
});
db.newUser({
    firstName: 'Helen',
    lastName: 'Roberts',
    eMail: 'Roberts@Helen.com',
    password: 'Helen',
});
db.newUser({
    firstName: 'Irene',
    lastName: 'Clarke',
    eMail: 'Clarke@Irene.com',
    password: 'Irene',
});
db.newUser({
    firstName: 'Loretta',
    lastName: 'White',
    eMail: 'White@Loretta.com',
    password: 'Loretta',
});
db.newUser({
    firstName: 'Margaret',
    lastName: 'Turner',
    eMail: 'Turner@Margaret.com',
    password: 'Margaret',
});
db.newUser({
    firstName: 'Nora',
    lastName: 'Thompson',
    eMail: 'Thompson@Nora.com',
    password: 'Nora',
});
db.newUser({
    firstName: 'Roxanne',
    lastName: 'Phillips',
    eMail: 'Phillips@Roxanne.com',
    password: 'Roxanne',
});
db.newUser({
    firstName: 'Trudy',
    lastName: 'Carter',
    eMail: 'Carter@Trudy.com',
    password: 'Trudy',
});
db.newUser({
    firstName: 'Nancy',
    lastName: 'Parker',
    eMail: 'Parker@Nancy.com',
    password: 'Nancy',
});
db.newUser({
    firstName: 'Wanda',
    lastName: 'Lee',
    eMail: 'Lee@Wanda.com',
    password: 'Wanda',
});

db.newProfile(
    {
        age: 35,
        city: 'cleveland',
        homepage: 'https://www.google.com/cleveland',
        managers: 20,
    },
    10
);
db.newProfile(
    {
        age: '',
        city: 'madison',
        homepage: 'https://www.google.com/madison',
        managers: 12,
    },
    4
);
db.newProfile({ age: 78, city: 'dallas', homepage: '', managers: '' }, 3);
db.newProfile(
    {
        age: 45,
        city: 'Pasadena',
        homepage: 'https://www.google.com/Pasadena',
        managers: '',
    },
    2
);
db.newProfile(
    {
        age: '',
        city: 'dallas',
        homepage: 'https://www.google.com/dallas',
        managers: 23,
    },
    1
);
db.newProfile(
    {
        age: 41,
        city: 'madison',
        homepage: 'https://www.google.com/madison',
        managers: 5,
    },
    5
);
db.newProfile({ age: 38, city: 'Pasadena', homepage: '', managers: 9 }, 9);
db.newProfile(
    {
        age: 67,
        city: 'cleveland',
        homepage: 'https://www.google.com/cleveland',
        managers: 33,
    },
    11
);
db.newProfile(
    { age: 45, city: '', homepage: 'https://www.google.com/', managers: 18 },
    13
);
db.newProfile(
    {
        age: 90,
        city: 'Pasadena',
        homepage: 'https://www.google.com/Pasadena',
        managers: 45,
    },
    12
);
db.newProfile({ age: 47, city: 'cleveland', homepage: '', managers: 8 }, 15);
db.newProfile(
    {
        age: 60,
        city: 'cleveland',
        homepage: 'https://www.google.com/cleveland',
        managers: 10,
    },
    16
);
db.newProfile({ age: 51, city: 'madison', homepage: '', managers: '' }, 14);
db.newProfile(
    { age: '', city: '', homepage: 'https://www.google.com/', managers: 5 },
    8
);
db.newProfile(
    {
        age: 64,
        city: 'dallas',
        homepage: 'https://www.google.com/dallas',
        managers: 1,
    },
    7
);
db.newProfile(
    {
        age: 54,
        city: 'madison',
        homepage: 'https://www.google.com/madison',
        managers: 3,
    },
    6
);
