var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Book = mongoose.model('Book');

// middleware that is specific to this router
function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
};

router.use('/boo', timeLog);
/*  "/books"
 *  GET: finds all books
 *  POST: create new book
 */
router.route('/boo')
  .get(function(req, res) {
      Book.find(function(err, books) {
        if(err) {
           res.send(500, err);
      //  handlerError(res, err.message, "Failed to get books.");
        console.log("hello :(");
        } else {
        // return res.send(books);
          res.status(200).send(books);
          console.log("hello");
        }
        
      });
    })
  .post(function(req, res) {
    var book = new Book();
    book.title = req.body.title;
    book.description = req.body.description;
    book.save(function(err, book) {
      if(err) {
        return res.send(500, err);
      }
      return res.json(book);
    });
  });
/*  "/books/:id"
 *  GET: finds book by id
 *  PUT: update books by id
 *  DELETE: deletes books by id
 */
router.route('/boo/:id')
// get specified book
  .get(function(req, res) {
    Book.findById(req.params.id, function(err, book) {
      if(err) res.send(err);
      res.json(book);
    });
  })
  // update specified book
  .put(function(req, res) {
    Book.findById(req.params.id, function(err, book) {
      if(err) {
        res.send(err);
      } else {
        book.title = req.body.title;
        book.description = req.book.description;
        book.save(function(err, book) {
          if(err) res.send(err);
            res.json(book);
        });
      }
    });
  })
  .delete(function(req, res) {
    Book.remove({ _id: req.params.id}, function(){
      if(err) res.send(err);
        res.json("delete :(")
      });
    });

module.exports = router;