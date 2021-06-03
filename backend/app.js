var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var {format} = require('util');
var fs = require('fs')
var {Storage} = require('@google-cloud/storage');
var cors = require('cors')

const projectId = 'hiding-place-312704'
const keyFilename = './credentials/hiding-place-312704-1d444180b02e.json'

const storage = new Storage({projectId, keyFilename})

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const { type } = require('os');

var app = express();

const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET)

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.post("/upload", (req,res,next)=>{
    console.log(req.body)
    const blob1 = bucket.file("input.json");
    const blobWriteStream = blob1.createWriteStream();

    blobWriteStream.on('error', err => {
        next(err);
    });
    
    blobWriteStream.end(req.body.input);
    next();
}, (req,res)=>{
    const blob2 = bucket.file('output.json');
    const blobReadStream = blob2.createReadStream();
    var buf = ''

    blobReadStream.on('error', err =>{
        next(err);
    });

    blobReadStream.on('data', (d)=>{
        buf += d
    }).on('end',()=>{
        console.log(typeof(buf))
        console.log(buf);
        console.log("End");
        res.status(200).send(buf);
    })
});

module.exports = app;
