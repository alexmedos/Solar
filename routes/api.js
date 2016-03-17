var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var assert      = require('assert');
var path        = require("path");
var ObjectID    = require('mongodb').ObjectID;
var url         = 'mongodb://localhost:27017/Solar';

/* GET users listing. */
router.get('/', function(req, res) {
  var db = req.db;
  var collection = db.get('readingstest2');
  collection.find({},{},function(e,docs){
    res.json(docs);
  });
})


router.post('/', function(req, res) {
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Successful post");
    insertDocument(req, db, function() {
    db.close();
    });
  });
  res.json({message : "Panel successfully registered."});
});

module.exports = router;

var insertDocument = function(req, db, callback) {
  var power = req.body.voltage * req.body.current;
  db.collection('readingstest2').insertOne( {
    "voltage"   : req.body.voltage,
    "current"   : req.body.current,
    "power"     : power,
    "time"      : getDateTime()
  }, function(err, result) {
    assert.equal(err, null);
    console.log("Inserted a document into the panel collection.");
    callback();
  });
};

function getDateTime() {

  var date = new Date();

  var hour = date.getHours();
  hour = (hour < 10 ? "0" : "") + hour;

  var min  = date.getMinutes();
  min = (min < 10 ? "0" : "") + min;

  var sec  = date.getSeconds();
  sec = (sec < 10 ? "0" : "") + sec;

  var year = date.getFullYear();

  var month = date.getMonth() + 1;
  month = (month < 10 ? "0" : "") + month;

  var day  = date.getDate();
  day = (day < 10 ? "0" : "") + day;

  return year + "/" + month + "/" + day + "  " + hour + ":" + min + ":" + sec;

}