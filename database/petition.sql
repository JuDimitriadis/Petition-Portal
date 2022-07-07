-- DROP TABLE IF EXISTS profiles;

-- DROP TABLE IF EXISTS signatures;

-- DROP TABLE IF EXISTS users;

-- DROP TABLE IF EXISTS petitions;

CREATE TABLE users (
    id SERIAL primary key, 
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(150) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    hash_password VARCHAR NOT NULL UNIQUE,
    creted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

CREATE TABLE profiles (
    id SERIAL primary key, 
    user_ID INT REFERENCES users (id) NOT NULL UNIQUE,
    age INT,
    city  TEXT,
    homepage TEXT,
    managers INT,
    create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    
);

CREATE TABLE signatures (
    id SERIAL primary key, 
    user_ID INT REFERENCES users (id) NOT NULL,
    signature TEXT NOT NULL,
    petition_name VARCHAR(10) NOT NULL,
    petition_tittle VARCHAR NOT NULL, 
    create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    
);

CREATE TABLE petitions (
    id SERIAL primary key, 
    name VARCHAR(10) NOT NULL UNIQUE,
    tittle VARCHAR NOT NULL,
    image VARCHAR,
    description TEXT NOT NULL,
    create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

-- INSERT INTO petitions (name, tittle, image,description) 
-- VALUES ('no_selfie', 'Let''s make selfie illegal', '/noSelfie.png', 'We must end the selfie culture where all the happy people are constantly taking selfies of happy moments and posting them on social media. This is ruining our children''s future, and we must stop it as soon as possible.' );

-- INSERT INTO petitions (name, tittle, image,description)
-- VALUES ('mail', 'Let''s legalize poke around neighbours mail', '/mail.png', 'It is completely to just see our happy neighbors from afar, receiving several packages and envelopes daily, we must supervise and ensure that our happy and hardworking neighbors are not using the post services for anything illegal.  That''s why we must immediately ensure that every good citizen are allowed to poke around theirs neighbors mailbox and packages.');

