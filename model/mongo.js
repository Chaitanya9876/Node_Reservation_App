var mongoose = require("mongoose");
var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({
  extended: false
}))


app.use(bodyParser.json())
var MongoClient = require('mongodb').MongoClient,
  ObjectID = require('mongodb').ObjectID;

  //connection to mongoDB database
var url = "mongodb://localhost:27017/chaitudb";

//Returns all the reservations
app.get('/reservations', function(req, res) {


  MongoClient.connect(url, function(err, db) {
    var array = [];
    if (err) throw err;
    db.collection("reservationdb").find({}).toArray(function(err, result) {
      if (err) throw err;

      //Returns all reservations that match the search criteria
      if (req.query.hotelName != undefined &&
         req.query.arrivalDate != undefined &&
         req.query.departureDate != undefined) {
        result.forEach(function(element) {
          if (req.query.hotelName == element.hotelName ||
             req.query.arrivalDate == element.arrivalDate ||
              req.query.departureDate == element.departureDate) {
            array.push(element);
            console.log(array);
          }
        });
        res.json(array);
      } else {
        res.json(result);
      }
      db.close();
    });
  });
});

//create a new reservation,assigns an _id to it, and returns that _id
     app.post('/reservation', function(req, res) {
     console.log(req.body);

     MongoClient.connect(url, function(err, db) {
     if (err) throw err;

     db.collection("reservationdb").insertOne(req.body, function(err, result1) {
      if (err) throw err;
      else {
        console.log("1 document inserted");
        var query = {
          id: req.body.id
        };
        db.collection("reservationdb").find(query).toArray(function(err, result2) {
          if (err) throw err;
          else {
            console.log(result2[0]._id);
            res.json(result2[0]._id);
          }

          db.close();
        });
      }

      db.close();
    });
  });

});

// Returns a single reservation with _id
app.get('/reservation/:id', function(req, res) {
  var obj_id = new ObjectID(req.params.id);
  MongoClient.connect(url, function(err, db) {
    var query = {
      _id: obj_id
    };
    db.collection("reservationdb").find(query).toArray(function(err, result2) {
      if (err) throw err;
      else {

        res.json(result2);
      }

      db.close();
    });
  });
});

app.listen(3000);
console.log("Listening to PORT 3000");
