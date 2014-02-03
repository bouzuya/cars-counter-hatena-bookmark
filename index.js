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

    counts = counts.map(function(count) {
      var newCount = count;
      Object.keys(labels).forEach(function(key) {
        if (key === count.label) {
          newCount = { label: labels[key], count: count.count };
        }
      });
      return newCount;
    });

    callback(null, counts);
  });
};

module.exports = getCount;
