var counter = require('../');

counter(function(err, counts) {
  if (err) throw err;
  console.log(counts);
});
