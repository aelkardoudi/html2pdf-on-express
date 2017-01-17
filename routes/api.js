var express = require('express');
var router = express.Router();
var wkhtmltopdf = require('wkhtmltopdf');
var multer = require('multer');
var fileUpload = multer({
  dest: './tmp/'
}).single('file');
var fs = require("fs");


router.post('/html2pdf', fileUpload, function(req, res) {
  console.log(req.file);
  if (req.file.mimetype == "text/html") {
    res.set('Content-Type', 'application/pdf');
    wkhtmltopdf(fs.createReadStream(req.file.path), {
      pageSize: 'letter'
    }, function(err, stream) {
      if (err) {
        console.error(err);
      }
    }).pipe(res);
  } else {
    res.status(400).send("400 : Bad request or a bad type !");
  }

});

router.post('/url2pdf', function(req, res) {
  res.set('Content-Type', 'application/pdf');
  wkhtmltopdf(req.body.url, {
      pageSize: 'letter'
    }, function(err, stream) {
      if (err) {
        console.error(err);
      }
    })
    .pipe(res);
});

module.exports = router;
