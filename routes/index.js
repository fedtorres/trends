var express = require('express');
var https = require('https');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('form');
});

router.post('/submit', function(req, res, next) {
  const country = req.body.country;
  const category = req.body.category;
  const columns = parseInt(req.body.columns);
  const rows = parseInt(req.body.rows);
  var trendsUrl = 'https://api.mercadolibre.com/trends/' + country;
  if(category !== '') {
    trendsUrl += '/' + category;
  }
  https.get(trendsUrl, (resp) => {
    let data = '';
    resp.on('data', (chunk) => {
      data += chunk;
    });
    resp.on('end', () => {
      var trendsData = JSON.parse(data);
      var trendsArray = new Array(rows);
      for(var i = 0; i < trendsArray.length; i++) {
        trendsArray[i] = trendsData.slice(i*rows, i*rows+columns);
      }
      res.render('trends', { trends: trendsArray });
    });
  }).on("error", (err) => {
    console.log("Error: " + err.message);
  });
});

module.exports = router;
