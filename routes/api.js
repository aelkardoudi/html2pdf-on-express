var express = require('express');
var router = express.Router();
var multer = require('multer');
var fileUpload = multer({
  dest: './tmp/'
}).single('file');
var fs = require("fs");
var phStreamer = require("phantom-render-stream")({
  format: 'pdf',
  paperFormat: 'A4',
  orientation: 'portrait',
  width: 25000
});



router.post('/html2pdf', fileUpload, function(req, res) {
  console.log("init");
  if (req.file.mimetype == "text/html") {
    res.set('Content-Type', 'application/pdf');
    fs.createReadStream(req.file.path)
      .pipe(phStreamer())
      .pipe(res);
  } else {
    res.status(400).send("400 : Bad request or a bad type !");
  }

});

router.post('/url2pdf', function(req, res) {
  res.set('Content-Type', 'application/pdf');
  phStreamer(req.body.url)
    .pipe(res);
});

module.exports = router;
