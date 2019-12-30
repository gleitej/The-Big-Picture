const aws = require('aws-sdk');
const express = require('express');
const multer = require('multer');
const multerS3 = require('multer-s3');
const router = express.Router();

// move keys to seperate module
aws.config.update({
  accessKeyId: 'KEY',
  secretAccessKey: 'KEY',
  region: 'KEY'
});
const s3 = new aws.S3();

// file filter
function checkFileType(file, cb) {
  // allowed ext
  const filetypes = /jpeg|jpg|png|gif|cr2/;
  // check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // check mime type
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: images only');
  }
}

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'shootforthemoon-photos',
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function(req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function(req, file, cb) {
      cb(null, Date.now().toString());
    }
  })
});

module.exports = upload;
