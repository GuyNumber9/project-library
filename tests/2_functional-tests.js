/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server').app;
var db = require('../server').db;

chai.use(chaiHttp);

suite('Functional Tests', function() {
  
  before(function(done) {
    this.timeout(10000); // my internet is to slow for the database connections :(
      db.once('open', (err) => {
        done();
      });
  });

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
    this.timeout(5000);
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {

    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        this.timeout(5000);
        let book = {
          title: 'Cook book'
        };

        chai.request(server)
        .post('/api/books')
        .send(book)
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.title, book.title, `Book title should be '${book.title}' got '${res.body.title}'`);
          assert.property(res.body, '_id', 'Book should contain property _id');
          assert.property(res.body, 'comments', 'Book should contain property "comments"');
          done();
        })
      });
      
      test('Test POST /api/books with no title given', function(done) {
        this.timeout(5000);
        let book = {
          title: ''
        };

        chai.request(server)
        .post('/api/books')
        .send(book)
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'missing title', `Response should be 'missing title' got '${res.body}'`);
          done();
        })
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        this.timeout(5000);
        chai.request(server)
        .get('/api/books')
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body, 'response should be an array');
          assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
          assert.property(res.body[0], 'title', 'Books in array should contain title');
          assert.property(res.body[0], '_id', 'Books in array should contain _id');
          done();
        });
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        this.timeout(5000);
        chai.request(server)
        .get('/api/books/5dde961267763628af923443')
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'no book exists', `Expected 'no book exists', got '${res.body}'`);
          done();
        })
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        this.timeout(5000);
        chai.request(server)
        .get('/api/books/5dde961267763628af9bcf21')
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.title, 'The Good Book', `Expected 'book.title' to equal 'The Good Book' got '${res.body.title}'`);
          assert.property(res.body, 'comments', 'Expected Book to have property "comments"');
          assert.property(res.body, '_id', 'Expected Book to have property "_id"');
          done();
        })
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        this.timeout(5000);
        let comment = {
          comment: 'Test comment'
        };

        chai.request(server)
        .post('/api/books/5dde961267763628af9bcf21')
        .send(comment)
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.property(res.body, 'title', 'Books in array should contain title');
          assert.property(res.body, 'comments', 'Expected Book to have property "comments"');
          assert.property(res.body, '_id', 'Expected Book to have property "_id"');
          assert.isArray(res.body.comments, 'book.comments should be an array');
          let comments = res.body.comments.map((c) => c.comment);
          chai.expect(comments).to.include(comment.comment, 'book.comments does not contain posted comment');
          done();
        });
      });
      
    });

  });

});
