// Create a new router
const express = require("express")
const bcrypt = require("bcrypt")
const router = express.Router()
const { check, validationResult, checkSchema } = require('express-validator')

const saltRounds = 10

const redirectLogin = (req, res, next) => {
    if (!req.session.userId ) {
        res.redirect('./login') // redirect to the login page
    } else {
        next (); // move to the next middleware function
    }
}

router.get('/register', function(req, res, next) {
    res.render('register.ejs')                                                               
})    

router.post('/registered',
    checkSchema({
        password: { isLength: { options: { min: 8 }}},
        username: { isLength: { options: { min: 4 }}},
    }), 
    function(req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors)
            res.redirect('./register');
        } else {
            // saving data in database
            const plainPassword = req.body.password
            let sqlquery = "INSERT INTO users (username, password) VALUES (?,?)"
            
            bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword) {
                // catch error
                if(err) {
                    next(err)
                }
                // Store hashed password in your database.
                let newrecord = [req.sanitize(req.body.username), hashedPassword]
                // execute sql query
                db.query(sqlquery, newrecord, (err, result) => {
                    if (err) {
                        next(err)
                    } else {
                        result = req.sanitize(req.body.username + ' you are now registered!\n')
                        result += 'Your password is: '+ req.sanitize(req.body.password) +' and your hashed password is: '+ hashedPassword
                        res.send(result)
                    }
                })
            })
        }
})

router.get('/list', redirectLogin, function(req, res, next) {
    let sqlquery = "SELECT username FROM users"

    db.query(sqlquery, (err, result) => {
        if(err) {
            next(err)
        }
        res.render("listUsers.ejs", {users:result})
    })
})

router.get('/login', function(req, res, next) {
    res.render('login.ejs')
})
router.post('/login', function(req, res, next) {
    res.render('login.ejs')
})


router.post('/loggedin', function(req, res, next) {
    let sqlquery = "SELECT password FROM users WHERE username=?;" // using ? param prevents SQL injection
    
    db.query(sqlquery, [req.body.username], (err, result) => {
        if(err){
            next(err)
        } else {
            if(result.length === 0){
                return res.send("incorrect username");
            }

            const hashedPassword = result[0].password;

            bcrypt.compare(req.body.password, hashedPassword, function(err, result) {
                if (err) {
                    next(err)
                } else if (result == true) {
                    // Save user session here, when login is successful
                    req.session.userId = req.body.username;
                    res.send("login successful")
                } else {
                    res.send("incorrect password")
                }
            })
        }
    })
})

// Export the router object so index.js can access it
module.exports = router