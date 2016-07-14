require('../db/connect');
global.environment = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var mongoose = require('mongoose');

var server = require('../server.js');
var Item = require('../models/item.js');
var seed = require('../db/seed.js');
var app = server.app;

var should = chai.should();

chai.use(chaiHttp);

describe('Shopping List', function() {
  
    beforeEach(function(done) {
        mongoose.connection.db.dropDatabase( function( error, response ) {
            seed.run(function() {
                done();
            });
        });
    });
    it('should list items on GET', function(done) {
        chai.request(app)
            .get('/items')
            .end(function(err, response) {
                should.equal(err, null);
                response.should.have.status(200);
                response.should.be.json;
                response.body.should.be.a('array');
                response.body.should.have.length(3);
                response.body[0].should.be.a('object');
                response.body[0].should.have.property('_id');
                response.body[0].should.have.property('name');
                response.body[0]._id.should.be.a('string');
                response.body[0].name.should.be.a('string');
                response.body[0].name.should.equal('Broad beans');
                response.body[1].name.should.equal('Tomatoes');
                response.body[2].name.should.equal('Peppers');
                done();
            });

    });

    it('should list item with given ID on GET', function(done) {
        chai.request(app)
            .get('/items')
            .end(function(error, res) {
                var item = res.body[0]._id.substring(0, 25);
                chai.request(app)
                .get('/items/' +  item)
                .end(function(err, response) {
                    should.equal(err, null);
                    response.should.have.status(200);
                    response.should.be.json;
                    response.body.should.be.a('object');
                    response.body.should.have.property('_id');
                    response.body.should.have.property('name');
                    response.body._id.should.be.a('string');
                    response.body.name.should.be.a('string');
                    response.body.name.should.equal(res.body[0].name);
                    done();
                });
            });
    });

    it('should add an item on POST', function(done) {
        chai.request(app)
            .post('/items')
            .send({
                'name': 'Kale'
            })
            .end(function(err, response) {
                chai.request(app)
                    .get('/items')
                    .end(function(error, res) {
                    should.equal(err, null);
                    response.should.have.status(201);
                    response.should.be.json;
                    response.body.should.be.a('object');
                    response.body.should.have.property('name');
                    response.body.should.have.property('_id');
                    response.body.name.should.be.a('string');
                    response.body._id.should.be.a('string');
                    response.body.name.should.equal('Kale');
                    res.body.should.be.a('array');
                    res.body.should.have.length(4);
                    res.body[3].should.be.a('object');
                    res.body[3].should.have.property('_id');
                    res.body[3].should.have.property('name');
                    res.body[3]._id.should.be.a('string');
                    res.body[3].name.should.be.a('string');
                    res.body[3].name.should.equal('Kale');
                done();
            });
        });
    });

    it('should edit an item on PUT', function(done) {
        chai.request(app)
            .get('/items')
            .end(function(error, resp) {    
            var item = resp.body[1]._id.substring(0, 25);
            chai.request(app)
                .put('/items/' + item)
                .send({
                    'name': 'Kale'
                })
                .end(function(err, response) {
                    chai.request(app)
                    .get('/items')
                    .end(function(error, res) {
                        should.equal(err, null);
                        response.should.have.status(200);
                        response.should.be.json;
                        response.body.should.be.a('object');
                        res.body.should.be.a('array');
                        res.body.should.have.length(3);
                        res.body[1].should.be.a('object');
                        res.body[1].should.have.property('_id');
                        res.body[1].should.have.property('name');
                        res.body[1]._id.should.be.a('string');
                        res.body[1].name.should.be.a('string');
                        res.body[1].name.should.equal('Kale');
                        done();
                    });
                });
            });
    });

    it('should delete an item on DELETE', function(done) {
        chai.request(app)
            .get('/items')
            .end(function(error, resp) {    
            var item = resp.body[1]._id.substring(0, 25);
            chai.request(app)
                .delete('/items/' + item)
                .end(function(err, response) {
                    chai.request(app)
                    .get('/items')
                    .end(function(error, res) {
                        should.equal(err, null);
                        response.should.have.status(200);
                        response.should.be.json;
                        response.body.should.be.a('object');
                        res.body.should.have.length(2);
                        res.body[1]._id.should.equal(resp.body[2]._id);
                        done();
                    });   
                });
            });
    });
    
    after(function(done) {
        Item.remove(function() {
            done();
        });
    });
});

/*----------------------- OTHER TESTS ----------------------*/

    // it('should add an item on PUT when ID is empty', function(done) {
    //     chai.request(app)
    //         .put('/items/17880135c71af9bc335b64f7')
    //         .send({
    //             'name': 'Carrot'
    //         })
    //         .end(function(err, response) {
    //             should.equal(err, null);
    //             response.should.have.status(201);
    //             response.should.be.json;
    //             response.body.should.be.a('object');
    //             response.body.should.have.property('name');
    //             response.body.should.have.property('_id');
    //             response.body.name.should.be.a('string');
    //             response.body.id.should.be.a('number');
    //             response.body.name.should.equal('Carrot');
    //             storage.items.should.be.a('array');
    //             storage.items.should.have.length(7);
    //             storage.items[6].should.be.a('object');
    //             storage.items[6].should.have.property('_id');
    //             storage.items[6].should.have.property('name');
    //             storage.items[6].id.should.be.a('number');
    //             storage.items[6].name.should.be.a('string');
    //             storage.items[6].name.should.equal('Carrot');
    //             storage.items[6].id.should.equal(10);
    //             done();
    //     });
    // });

       // it('should list users on GET', function(done) {
    //     chai.request(app)
    //         .get('/users')
    //         .end(function(err, response) {
    //             should.equal(err, null);
    //             response.should.have.status(200);
    //             response.should.be.json;
    //             response.body.should.be.a('array');
    //             response.body.should.have.length(1);
    //             response.body[0].should.be.a('object');
    //             response.body[0].should.have.property('username');
    //             response.body[0].should.have.property('items');
    //             response.body[0].items.should.be.a('array');
    //             response.body[0].username.should.be.a('string');
    //             response.body[0].items[0].name.should.equal('Plantain');
    //             response.body[0].items[0].id.should.equal(7);
    //             response.body[0].username.should.equal('Joe');
    //             storage.items[3].name.should.equal('Plantain');
    //             done();
    //         });
    // });

    // it('should list user\'s items with username on GET', function(done) {
    //     chai.request(app)
    //         .get('/users/Joe/items')
    //         .end(function(err, response) {
    //             should.equal(err, null);
    //             response.should.have.status(200);
    //             response.should.be.json;
    //             response.body.should.be.a('array');
    //             response.body.should.have.length(1);
    //             response.body[0].should.be.a('object');
    //             response.body[0].should.have.property('name');
    //             response.body[0].should.have.property('id');
    //             response.body[0].name.should.be.a('string');
    //             response.body[0].id.should.be.a('number');
    //             response.body[0].name.should.equal('Plantain');
    //             response.body[0].id.should.equal(7);
    //             done();
    //         });
    // });

  // it('should add a user including items on POST', function(done) {
    //     chai.request(app)
    //         .post('/users')
    //         .send(
    //             {"username": "Chris", "items": [{"name": "Eggs", "id": 9}]}
    //         )
    //         .end(function(err, response) {
    //             should.equal(err, null);
    //             response.should.have.status(201);
    //             response.should.be.json;
    //             response.body.should.be.a('object');
    //             response.body.should.have.property('username');
    //             response.body.should.have.property('items');
    //             response.body.username.should.be.a('string');
    //             response.body.items.should.be.a('array');
    //             response.body.username.should.equal('Chris');
    //             response.body.items[0].name.should.equal('Eggs');
    //             response.body.items[0].id.should.equal(9);
    //             storage.items.should.have.length(6);
    //             storage.items[5].name.should.equal('Eggs');
    //             storage.items[5].id.should.equal(9);
    //             done();
    //         });
    // });

   // it('should change username on PUT', function(done) {
    //     chai.request(app)
    //         .put('/users/Joe')
    //         .send({
    //             'username': 'Martin'
    //         })
    //         .end(function(err, response) {
    //             should.equal(err, null);
    //             response.should.have.status(200);
    //             response.should.be.json;
    //             response.body.should.be.a('object');
    //             response.body.should.have.property('username');
    //             response.body.should.have.property('items');
    //             response.body.username.should.be.a('string');
    //             response.body.items.should.be.a('array');
    //             response.body.username.should.equal('Martin');
    //             storage.users.should.be.a('array');
    //             storage.users.should.have.length(2);
    //             storage.users[0].should.be.a('object');
    //             storage.users[0].should.have.property('username');
    //             storage.users[0].should.have.property('items');
    //             storage.users[0].username.should.be.a('string');
    //             storage.users[0].items.should.be.a('array');
    //             storage.users[0].username.should.equal('Martin');
    //             storage.users[0].items[0].name.should.equal('Plantain');
    //             done();
    //         });

    // });
    
      // it('should delete a user on DELETE', function(done) {
    //     chai.request(app)
    //         .delete('/users/Martin')
    //         .end(function(err, response) {
    //             should.equal(err, null);
    //             response.should.have.status(200);
    //             response.should.be.json;
    //             response.body.should.be.a('object');
    //             response.body.should.have.property('username');
    //             response.body.should.have.property('items');
    //             response.body.username.should.be.a('string');
    //             response.body.items.should.be.a('array');
    //             response.body.username.should.equal('Martin');
    //             storage.items.should.have.length(5);
    //             storage.users.should.have.length(1);
    //             storage.users[0].username.should.equal('Chris');
    //             done();
    //         });
    // });
    