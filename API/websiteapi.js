const express = require("express");
const router = express.Router();
const fetch = require('node-fetch');
const env = 'localhost';
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var urlEncodedParser = bodyParser.urlencoded({ extended: false });

router.get('/',function(req,res){
    res.render('index');
});
//Get
router.get('/tracking',function(req,res){
    if(req.query && req.query.tracking_num){
        fetch(`http://${env}:3000/v1/tracking/`+req.query.tracking_num).then(res => res.json()).then(json => {
            console.log(json);
            res.render('tracking_res',{data: json});
        }).catch(err => {
            console.log(err);
            res.send('error happened');
        })
    }
    else{
        res.render('tracking');
    }
})
router.get('/deleteConnection',function(req,res){
    res.render('deleteConnection')
})
//Delete
router.get('/connectionDelete',function(req,res){
    fetch(`http://${env}:3000/v1/tracking/`+req.query.tracking_num,{
        method: 'delete'
    })
    .then(result => {
        res.send('Shipment deleted successfully');
    })
    .catch(err => {
        res.send(err);
    })
});

//PATCH
router.get('/patchConnections',function(req,res){
    res.render('patchConnections')
})
router.post('/patchConnections', urlEncodedParser, jsonParser, function(req, res){
    console.log(req.body);
   
    var body= {
        'destination':req.body.destination,
        'tracking_num':req.body.tracking_num 
    };
    console.log(body);
    fetch(`http://${env}:3000/v1/tracking`, {
        method: 'PATCH',
        body: JSON.stringify(body),
        headers: {'Content-Type': 'application/json'}
    }).then(json => {
        // var tracking = json.tracking;
        res.send('Updated Successfully');
    })

})

//Post
router.get('/newOrder',function(req,res){
    res.render('newOrder')
})
router.post('/newOrder', urlEncodedParser, jsonParser, function(req, res){
        console.log(req.body);
   
    var body= {
 "src": req.body.src,
 "sender_mobile_num": req.body.sender_mobile_num,
 "destination" : req.body.destination,
 "receiver_mobile_num" : req.body.receiver_mobile_num,
 "shipment_type": req.body.shipment_type
    };
    fetch(`http://${env}:3000/v1/tracking`, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' }
    })
    // .then(res => res.json())
    .then(json => {
        console.log(json);
        //var restaurant = json.restaurant;
        res.send('New Order Added Successfully');
    })

})

//PUT
router.get('/editConnections',function(req,res){
    res.render('editConnections')
})
router.post('/editConnections', urlEncodedParser, jsonParser, function(req, res){
    
    console.log(req.body);
   
    var body= {
        "tracking_num" : req.body.tracking_num,
        "src": req.body.src,
        "sender_mobile_num": req.body.sender_mobile_num,
        "destination" : req.body.destination,
        "receiver_mobile_num" : req.body.receiver_mobile_num,
        "shipment_type": req.body.shipment_type
    };
    fetch(`http://${env}:3000/v1/tracking`, {
        method: 'PUT',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' }
    })
    // .then(res => res.json())
    .then(json => {
        console.log(json);
        //var restaurant = json.restaurant;
        res.send('Updated Successfully');
    })

})


module.exports = router;