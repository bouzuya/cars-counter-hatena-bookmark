var fetch = require('node-fetch');
var cheerio = require('cheerio');

var getCount = function(callback) {
  var url = 'http://b.hatena.ne.jp/bouzuya/';
  fetch(url)
  .then(function(response) {
    var status = response.status;
    if (status !== 200) throw new Error('invalid status code : ' + status);
    return response.text();
  })
  .then(function(html) {
    var $ = cheerio.load(html);
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
  })
  .catch(function(error) {
    callback(error);
  });
};

module.exports = getCount;
