var request = require('request');
var cheerio = require('cheerio');

var getCount = function(callback) {
  var url = 'http://b.hatena.ne.jp/bouzuya/';
  request({ url: url }, function(err, res, body) {
    if (err) return callback(err);
    if (res.statusCode !== 200) {
      var e = new Error('invalid status code : ' + res.statusCode);
      return callback(e);
    }

    var $ = cheerio.load(body);
    var counts = [];
    $('#profile-count-navi dl').each(function() {
      var label = $(this).find('dt').text();
      var value = $(this).find('dd').text().replace(/,/g, '');
      counts.push({ label: label, count: value });
    });

    var labels = {
      'ブックマーク': 'Hatena Bookmark',
      'お気に入り': 'Hatena Bookmark Follow',
      'お気に入られ': 'Hatena Bookmark Follower',
    };

    callback(null, counts.reduce(function(memo, count) {
      Object.keys(labels).forEach(function(label) {
        if (label === count.label) {
          memo[labels[label]] = count.count;
        }
      });
      return memo;
    }, {}));
  });
};

module.exports = getCount;
