// Import modules
const express = require('express');
const ejs = require('ejs');
const session = require('express-session');
const validator = require('express-validator');
const sanitizer = require('express-sanitizer');
const mysql = require('mysql2');

// Create express app
const app = express();
const port = 8000;

// Tell Express that we want to use EJS as the templating engine
app.set('view engine', 'ejs')

// Create an input sanitizer
app.use(sanitizer());

// Set up the body parser 
app.use(express.urlencoded({ extended: true }))

// Set up public folder (for css and statis js)
app.use(express.static(__dirname + '/public'))

// Create a session
app.use(session({
    secret: 'somerandomstuff',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}))

// Define the database connection
const db = mysql.createConnection ({
    host: 'localhost',
    user: 'dblurb_app',
    password: 'globglogabgalab',
    database: 'dblurb'
})

// Connect to the database
db.connect((err) => {
    if (err) {
        throw err
    }
    console.log('Connected to database')
})
global.db = db

// Load the route handlers
const mainRoutes = require("./routes/main")
app.use('/', mainRoutes)

const usersRoutes = require('./routes/users')
app.use('/users', usersRoutes)

const apiRoutes = require('./routes/api')
app.use('/api', apiRoutes)

const bookRoutes = require('./routes/book');
app.use('/book', bookRoutes);

// Start app
app.listen(port, () => console.log(`dblurb listening on port ${port}!`))