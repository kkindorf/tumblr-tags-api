var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var config = require('./config');
var https = require('https');
var SaveCard = require("./model/saveCard");

var app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(bodyParser.json());

var runServer = function(callback){
       mongoose.connect(config.DATABASE_URL, function(err){
        if(err && callback){
            return callback(err)
        }
        app.listen(config.PORT, function(){
            console.log('Listening on localhost: '+config.PORT);
            if(callback){
                callback();
            }
        })
    })
}
if(require.main === module){
    runServer(function(err){
        if(err){
            console.log(err)
        }
    })
}
app.options('*', function(req, res){
    return res.json({message: 'ok'})
})
  app.get('/status', function(req,res){
    return res.json({message: 'ok'})
})

app.get("/search", function(req, res){
   var query = Object.keys(req.query);
   var url = "https://api.tumblr.com/v2/tagged?tag="+query[0]+"&limit=500&api_key=F2iyRm0Ffc73oZncziOzs4SRvswAbAMQG4VS2ErSAHEtSB3JRz";
   https.get(url, function(resp){
       resp.pipe(res);
   })
});
app.get('/saved-cards', function(req, res){
    SaveCard.find()
    .limit(5)
    .sort('timeStamp')
    .skip(req.query.skip || 0)
    .exec(function(err, savedCards){
        if(err){
            return res.json({
                message: 'There was a problem returning your cards'
            })
        }
        SaveCard.count()
        .exec(function(err, count){
           if(err){
              return res.json({
                message: 'There was a problem returning the count'
            })
           }
           console.log(savedCards, count)
           res.json({savedCards: savedCards, count: count, skip: parseInt(req.query.skip)}) 
        })
    })
})
app.post('/saved-cards', function(req, res){
    SaveCard.create({
        src: req.body.postedData.src,
        blogName: req.body.postedData.blogName,
        summary: req.body.postedData.summary,
        timeStamp: req.body.postedData.timeStamp,
        postUrl: req.body.postedData.postUrl
        
    }, function(err, saveCard){
        if(err){
            
            return res.status(500).json({
                message: err
            })
        }
        res.status(201).json({saveCard});
    });
});

app.delete('/saved-cards/:id', function(req, res){
    var id = req.params.id;
    SaveCard.findByIdAndRemove(id, function(error){
        if(error){
            return res.status(400).json({
                message: 'You did not select a valid id'
            })
        }
        res.status(200).json(id)
    })
})

app.use('*', function(request, response){
    response.status(404).json({
        message: 'Endpoint Not Found'
    });
});


exports.app = app;
exports.runServer = runServer;
