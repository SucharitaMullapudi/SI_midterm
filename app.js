var express = require('express');
var app = express();
var mysql = require('mysql')
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var urlEncodedParser = bodyParser.urlencoded({ extended: false });
app.set('view engine', 'ejs');
app.use('/assets', express.static('assets'));
//console.log('hey')
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Saibaba!123',
    database: 'tracking_sys'
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected!');
});

app.get('/', function (req, res) {
    res.render('index');
});

app.get('/v1/tracking', function (req, res) {
    res.render('tracking');
})
app.get('/v1/tracking/:id', function (req, res) {
    let q = req.params;
    console.log(q);
    let query = `select * from tracking_data where tracking_num = ${q.id}`;
    console.log(query);
    connection.query(query, (err, rows) => {
        if (err) {
            res.send(err.sqlMessage + ' Please use a valid tracking number (i.e. from 1-10) and re-submit');
        }
        // console.log(rows.count);
        console.log(rows);
        console.log(rows.length);
        res.send(rows);
    });
});

app.post('/v1/tracking', urlEncodedParser, jsonParser, function (req, res) {
    let q = req.body;
    console.log(q);
    let query = `insert into tracking_data values(default,'${q.package_status}','${q.src}','${q.sender_mobile_num}',
    '${q.destination}','${q.receiver_mobile_num}','${q.shipment_type}')`;
    console.log(query);
    connection.query(query, (err, rows) => {
        if (err) {
            res.send(err.sqlMessage + ' Please use a proper details and re-submit');
        }
        // console.log(rows);
        else {
            res.send('Request added to the database succesfully');
        }
    })
});
app.delete('/v1/tracking/:id', function (req, res) {
    // console.log(req.params);
    let query = `DELETE FROM tracking_data WHERE tracking_num = ${req.params.id}`;
    // console.log(query);
    connection.query(query, (err, rows) => {
        if (err) {
            res.send(err.sqlMessage + ' Please use a valid tracking number(i.e from range 1-10) and re-submit');
        }
        console.log(rows);
        res.send('Record deleted succesfully');
    })
})
app.put('/v1/tracking', urlEncodedParser, jsonParser, function (req, res) {
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

app.patch('/v1/tracking', urlEncodedParser, jsonParser, function (req, res) {
let updateQuery = `UPDATE tracking_data SET package_status = '${req.body.package_status}'  WHERE tracking_num = ${req.body.tracking_num}` ;
    
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
app.listen(3000, function () {
    console.log('listening on port 3000');
})


