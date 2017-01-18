var express = require('express');
var router = express.Router();
var wkhtmltopdf = require('wkhtmltopdf');
var multer = require('multer');
var fileUpload = multer({
  dest: './tmp/'
}).single('file');
var fs = require("fs");
var pdf = require('html-pdf');
var phantom = require('phantom');



router.post('/html2pdf', fileUpload, function(req, res) {
  console.log("init");
  if (req.file.mimetype == "text/html") {
    res.set('Content-Type', 'application/pdf');
    pdf.create(req.file.path).toStream(function(err, stream) {
      if (err) {
        console.log("done with error");
        console.log(err);
      } else {
        stream.pipe(res);
        console.log("done sucessfully");
      }
    });
  } else {
    res.status(400).send("400 : Bad request or a bad type !");
  }

});

router.post('/url2pdf', function(req, res) {
  res.set('Content-Type', 'application/pdf');
  /*wkhtmltopdf(req.body.url, {
      pageSize: 'letter'
    }, function(err, stream) {
      if (err) {
        console.error(err);
      }
    })
    .pipe(res);*/
  var sitepage = null;
  var phInstance = null;
  phantom.create()
    .then(function(instance) {
      phInstance = instance;
      return instance.createPage();
    })
    .then(function(page) {
      sitepage = page;
      return page.open(req.body.url);
    })
    .then(function(status) {
      console.log(status);
      return sitepage.property('content');
    })
    .then(function(content) {
      console.log(content);
      sitepage.render("test.pdf");
      sitepage.close();
      res.end();
      phInstance.exit();
    })
    .catch(function functionName(error) {
      console.log(error);
      phInstance.exit();
    });
});

module.exports = router;
