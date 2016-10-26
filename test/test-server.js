global.DATABASE_URL = 'mongodb://localhost/tumblr-api-test';
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server.js');
var SaveCard = require('../model/saveCard')

var should = chai.should();
var app = server.app;
chai.use(chaiHttp);

describe('Tumblr Tags', function(){
    before(function(done){
        server.runServer(function(){
            SaveCard.create(
                    { src: 'www.google.com',
                      blogName: 'first blog name',
                      summary: 'this is a summary',
                      postUrl: 'http://posturl.com'},
                    { src: 'www.tumblr.com',
                      blogName: 'second blog name',
                      summary: 'another summary',
                      postUrl: 'http://imageurl.com'},
                      { src: 'www.cats.com',
                      blogName: 'new blog name',
                      summary: 'a third summaery',
                      postUrl: 'http://moreimages.com'}, function(){
                         
                 done();
                          
            })
        })
    })
   // var savedCards = ["first blog name", 'second blog name', 'new blog name'];
    it('should list saved cards on GET', function(done){
        chai.request(app)
        .get('/saved-cards')
        .end(function(err, res){
            should.equal(err, null);
            res.should.be.json;
            res.body.should.be.a('array');
            res.body.should.have.length(3);
            for (var i = 0; i < res.body.length; i++){
                res.body[i].should.be.a('object');
                res.body[i].should.have.property("_id");
                res.body[i].should.have.property("src");
                res.body[i].should.have.property("blogName");
                res.body[i].should.have.property("summary");
                res.body[i].should.have.property("postUrl");
                res.body[i].src.should.be.a("string");
                res.body[i].blogName.should.be.a("string");
                res.body[i].summary.should.be.a("string");
                res.body[i].postUrl.should.be.a("string");

            }
            done();
            
        })
    })
    it('should add a card on POST', function(done){
        chai.request(app)
        .post('/saved-cards')
        .send({
            postedData: {
            src: 'www.mywpl.com',
            blogName: 'kevins blog',
            summary: "this is kevin's blog",
            postUrl: 'image.com'
            }
        })
        .end(function(err, res){
          should.equal(err, null);
          res.should.have.status(201);
            res.should.be.json;
            res.body.saveCard.should.be.a("object");
            res.body.saveCard.should.have.property("_id");
            res.body.saveCard.should.have.property("src");
            res.body.saveCard.should.have.property("summary");
            res.body.saveCard.should.have.property("blogName");
            res.body.saveCard.should.have.property("postUrl");
            res.body.saveCard.src.should.be.a("string");
            res.body.saveCard.summary.should.be.a("string");
            res.body.saveCard.postUrl.should.be.a("string");
            res.body.saveCard.blogName.should.be.a("string");
          done();
        })
    })
    it("should delete an item on DELETE", function(done){
        var id;
        chai.request(app)
        .get("/saved-cards")
        .end(function(err, res){
            id = res.body[1]._id;
            chai.request(app)
            .delete("/saved-cards/"+id)
            .end(function(err, res){
                should.equal(err, null);
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a("string");
                res.body.should.equal(id);
                done();
                
            })
            
        })
        
    })

    
    after(function(done) {
        SaveCard.remove(function() {
            done();
        });
    });
})