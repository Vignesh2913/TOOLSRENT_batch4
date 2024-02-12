const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('port', process.env.PORT || 5000);

// Routes

// Home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});


app.get('/chat', (req, res) => {
    res.sendFile(path.join(__dirname, "public", 'Chat.html'));
})

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, "public", 'login.html'));
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, "public", 'signup.html'));
});

app.listen(app.get('port'), function() {
    console.log("Node app is running at localhost:" + app.get('port'))
})