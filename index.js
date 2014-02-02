var request = require('request');
var cheerio = require('cheerio');

var url = 'http://b.hatena.ne.jp/bouzuya/';

request({ url: url }, function(err, res, body) {
  if (err) throw err;
  if (res.statusCode === '200') throw new Error('invalid status code : ' + res.statusCode);
  var $ = cheerio.load(body);
  var counts = [];
  $('#profile-count-navi dl').each(function() {
    var label = $(this).find('dt').text();
    var value = $(this).find('dd').text().replace(/,/g, '');
    counts.push({ label: label, count: value });
  });

  var label = process.argv[2];
  var out = label ? counts.filter(function(c) { return c.label === label; })[0] : counts;
  console.log(out);
});


