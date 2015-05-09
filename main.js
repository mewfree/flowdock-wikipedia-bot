var conf = require('./conf.json');

var Wiki = require('wikijs');
var wiki = new Wiki();

var Session = require('flowdock').Session;
var session = new Session(conf.fdkey);

var CODE = '!wikipedia';

session.flows(function(err, flows) {
  var anotherStream, flowIds;
  flowIds = flows.map(function(f) {
    return f.id;
  });
  anotherStream = session.stream(flowIds);
  return anotherStream.on('message', function(message) {
    if (message.event == 'message') {
      var query = message.content;
      query = query.split(' ');
      if (query[0] == CODE) {
        query.shift();
        query = query.toString().replace(/,/g, ' ');
        wiki.search(query).then(function(data) {
          wiki.page(data.results[0]).then(function(page) {
            page.content().then(function(content) {
              var output = content.substring(0,400)+'...';
              console.log(output);
            });
          });
        });
      }
    }
  });
});
