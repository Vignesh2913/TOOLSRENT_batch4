const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const db = new sqlite3.Database('users1.db');

db.run(`
CREATE TABLE IF NOT EXISTS users(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    password TEXT
)
`);

db.run(`
CREATE TABLE IF NOT EXISTS submissions(
    id INTEGER PRIMARY KEY,
    name TEXT,
    contact_no TEXT,
    address TEXT,
    message TEXT
)
`);

db.run(`
CREATE TABLE IF NOT EXISTS rentinfo(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    tool_name TEXT NOT NULL,
    additional_comments TEXT
)
`);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "public", 'index.html'));
});

app.post('/submit', (req, res) => {
    const { Name, 'Contact no': contactNo, Address: address, Message: message } = req.body;

    db.run(`
        INSERT INTO submissions(name, contact_no, address, message) VALUES(?, ?, ?, ?)
    `, [Name, contactNo, address, message], (err) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Internal Server Error');
        } else {
            res.send('Form submitted successfully!');
        }
    });
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, "public", 'signup.html'));
});

app.post('/signup', (req, res) => {
    const { username, password } = req.body;
    db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, password], (err) => {
        if (err) {
            return res.status(500).send('Error creating user');
        }
        res.sendFile(path.join(__dirname, "public", 'login.html'));
    });
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, "public", 'login.html'));
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.get('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, row) => {
        if (err) {
            return res.status(500).send('Error checking user');
        }

        if (row) {
            res.sendFile(path.join(__dirname, "public", 'index.html'));
        } else {
            res.send('Invalid username or password');
        }
    });
});

app.get('/rent', (req, res) => {
    res.sendFile(path.join(__dirname, "public", 'rentinfo.html'));
});

app.post('/rent', (req, res) => {
    const { name, email, phone, date, time, tool_name, additional_comments } = req.body;

    db.run('INSERT INTO rentinfo (name, email, phone, date, time, tool_name, additional_comments) VALUES (?, ?, ?, ?, ?, ?, ?)', [name, email, phone, date, time, tool_name, additional_comments], (err) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send('Error submitting rent information');
        }
        res.sendFile(path.join(__dirname, "public", 'index.html'));
    });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Node app is running at localhost:${port}`);
});