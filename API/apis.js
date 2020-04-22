var express = require('express');
// var router = express();
var router = express.Router();
var mysql = require('mysql')
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var urlEncodedParser = bodyParser.urlencoded({ extended: false });


var connection = mysql.createConnection({
    // host: 'courierdb.cia0fvcbamfe.us-east-2.rds.amazonaws.com',
    // user: 'admin',
    host:'localhost',
    user: 'root',
    password: 'Saibaba!123',
    database: 'tracking_sys'
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected!');
});
router.get('/tracking/:id', function (req, res) {
    let q = req.params;
    let query = `select * from tracking_data where tracking_num = ${q.id}`;
    connection.query(query, (err, rows) => {
        if (err) {
            res.send(err.sqlMessage + ' Please use a valid tracking number (i.e. from 1-10) and re-submit');
        }
        // console.log(rows.count);
        //console.log(rows.length);
        res.send(rows);
    });
});


router.post('/tracking', urlEncodedParser, jsonParser, function (req, res) {
    let q = req.body;
    let query = `insert into tracking_data values(default,'${q.package_status}','${q.src}','${q.sender_mobile_num}',
    '${q.destination}','${q.receiver_mobile_num}','${q.shipment_type}')`;
    connection.query(query, (err, rows) => {
        if (err) {
            res.send(err.sqlMessage + ' Please use a proper details and re-submit');
        }
        else {
            res.send('Request added to the database succesfully');
        }
    })
});
router.delete('/tracking/:id', function (req, res) {
        // if(req.query && req.query.tracking_num){
         let q = req.params;
    let query = `DELETE FROM tracking_data WHERE tracking_num = ${req.params.id}`;
    connection.query(query, (err, rows) => {
        if (err) {
            res.send(err.sqlMessage + ' Please use a valid tracking number(i.e from range 1-10) and re-submit');
        }
        res.send('Record deleted succesfully');
    })
// }
// else{
//     res.render('editConnections');
// }
})
router.put('/tracking', urlEncodedParser, jsonParser, function (req, res) {
    let updateQuery = `UPDATE tracking_data SET src = '${req.body.src}',sender_mobile_num = '${req.body.sender_mobile_num}',
    destination = '${req.body.destination}',receiver_mobile_num = '${req.body.receiver_mobile_num}',
    shipment_type = '${req.body.shipment_type}' WHERE tracking_num = ${req.body.tracking_num}`;
    // console.log(query);

    let query = `select * from tracking_data where tracking_num = ${req.body.tracking_num}`;
    connection.query(query, (err, rows) => {
        if (err) {
            res.send(err.sqlMessage + ' Please use a different trakcing number(i.e. from 1-10) and re-submit');
        }
        if(rows.length != 0){
        connection.query(updateQuery,(err,rows) => {
            if(err){
                res.send('unable to update')
            }
            else{
                console.log(rows);
                res.send('Record updated succesfully');
            }
        })
    }
    else
    res.send(`The requested tracking number doesn't exist`);
    })
})

router.patch('/tracking', urlEncodedParser, jsonParser, function (req, res) {
    console.log(req.body);
let updateQuery = `UPDATE tracking_data SET destination = '${req.body.destination}'  WHERE tracking_num = ${req.body.tracking_num}` ;
console.log(updateQuery);    
let query = `select * from tracking_data where tracking_num = ${req.body.tracking_num}`;
    connection.query(query, (err, rows) => {
        if (err) {
            res.send(err.sqlMessage + ' Please use a different trakcing number(i.e. from 1-10) and re-submit');
        }
        if(rows.length != 0){
        connection.query(updateQuery,(err,rows) => {
            if(err){
                res.send('unable to update')
            }
            else{
                console.log(rows);
                res.send('Record updated succesfully');
            }
        })
    }
    else
    res.send(`The requested tracking number doesn't exist`);
    })
})

module.exports = router;


