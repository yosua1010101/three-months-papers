var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var Multer = require('multer');
var {format} = require('util');
var {Storage} = require('@google-cloud/storage');

const projectId = 'hiding-place-312704'
const keyFilename = './credentials/hiding-place-312704-1d444180b02e.json'

const storage = new Storage({projectId, keyFilename})

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

const uploadSingle = Multer({
    storage: Multer.memoryStorage(),
    limits: {
        fileSize: 16*1024*1024
    },
    
}).single('file');

const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET)

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.post("/upload", uploadSingle, (req,res,next)=>{
    if (!req.file){
        res.status(400).send('No file uploaded');
        return
    }

    const blob = bucket.file(req.file.originalname);
    const blobStream = blob.createWriteStream();

    blobStream.on('error', err => {
        next(err);
    });

    blobStream.on('finish', () => {
        const publicUrl = format(`https://storage.googleapis.com/${bucket.name}/${blob.name}`);
        res.status(200).send(publicUrl);
    });
    
    blobStream.end(req.file.buffer);
});

module.exports = app;
