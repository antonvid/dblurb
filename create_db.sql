-- Create database script

-- Create database
CREATE DATABASE IF NOT EXISTS dblurb;
USE dblurb;

-- Create tables
CREATE TABLE IF NOT EXISTS users (
    username VARCHAR(50), 
    password CHAR(60), 
    PRIMARY KEY(username)
);
CREATE TABLE IF NOT EXISTS user_books (
    username VARCHAR(50),
    book_isbn VARCHAR(13),
    action ENUM('liked', 'disliked'),
    PRIMARY KEY (username, book_isbn),
    FOREIGN KEY (username) REFERENCES users(username) ON DELETE CASCADE
);

-- Create app user
CREATE USER IF NOT EXISTS 'dblurb_app'@'localhost' IDENTIFIED BY 'globglogabgalab'; 
GRANT ALL PRIVILEGES ON dblurb.* TO 'dblurb_app'@'localhost';