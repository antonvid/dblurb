// Create a new router
const express = require("express")
const router = express.Router()
const request = require('request')

const redirectLogin = (req, res, next) => {
    if (!req.session.userId ) {
        res.redirect('../users/login') // redirect to the login page
    } else { 
        next (); // move to the next middleware function
    }
}

router.get('/random_book', (req,res,next) => {
    const apiKey = 'VBqfGbbTrDYCyqyYGeYft3AhCzqCrtTW';
    const fictionUrl = `https://api.nytimes.com/svc/books/v3/lists/current/combined-print-and-e-book-fiction.json?api-key=${apiKey}`;
    const nonfictionUrl = `https://api.nytimes.com/svc/books/v3/lists/current/combined-print-and-e-book-nonfiction.json?api-key=${apiKey}`;
    
    request(nonfictionUrl, function (err, response, body) {
        if(err){
            next(err)
        } else {
            const nonfiction = JSON.parse(body);
            const nonfictionBooks = nonfiction.results.books;

            request(fictionUrl, function (err, response, body) {
                if(err){
                    next(err)
                } else {
                    const fiction = JSON.parse(body);
                    const fictionBooks = fiction.results.books;

                    const books = nonfictionBooks.concat(fictionBooks);

                    res.send(books);
                }
            });
        }
    });
})

// Export the router object so index.js can access it
module.exports = router