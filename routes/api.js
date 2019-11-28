/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
const MONGODB_CONNECTION_STRING = process.env.DB;
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});

const Book    = require('../models/Book');
const Comment = require('../models/Comment');

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      Book.aggregate([
        {
            '$match': {}
        }, {
            '$project': {
                'title': 1, 
                'commentcount': {
                    '$size': '$comments'
                }
            }
        }
    ], (err, docs) => {
        if(err){
          res.send(err);
        }
        else {
          res.send(docs);
        }
      });
    })
    
    .post(function (req, res){
      var title = req.body.title;
      if(!title){
        res.send('missing title');
      }
      else {
        let book = new Book({
          title
        });
        book.save((err, doc) => {
          if(err){
            res.send(err);
          }
          else {
            res.json(doc);
          }
        });
      }
      //response will contain new book object including atleast _id and title
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      Book.deleteMany({}, (err) => {
        if(err){
          res.send(err);
        }
        else {
          res.send('complete delete successful');
        }
      })
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      var bookid = req.params.id;
      Book.findOne({
        _id: bookid
      }, (err, doc) => {
        if(err || !doc){
          res.send('no book exists');
        }
        else {
          res.json(doc);
        }
      });
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })
    
    .post(function(req, res){
      var bookid = req.params.id;
      var comment = req.body.comment;
      //json res format same as .get
      Book.findByIdAndUpdate(bookid, {
        "$push": {
          comments: new Comment.model({
            comment
          })
        }
      }, {
        'new': true,
        'useFindAndModify': false
      }, (err, doc) => {
        if(err){
          res.send(err);
        }
        else {
          res.json(doc);
        }
      });
    })
    
    .delete(function(req, res){
      var bookid = req.params.id;
      //if successful response will be 'delete successful'
      Book.deleteOne({
        _id: bookid
      }, (err) => {
        if(err){
          res.send(err);
        }
        else {
          res.send('delete successful');
        }
      })
    });
  
};
