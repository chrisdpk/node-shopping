var http = require('http');
var fs = require('fs');
var formidable = require('formidable');
const util = require('util');
const sqlite = require('sqlite3').verbose();
var db = new sqlite.Database("list.db");
clearDB();
var server = http.createServer(function (req, res) {
  if (req.method.toLowerCase() == 'get') {
    if (req.url == "/clear") {
      clearDB();
      res.writeHead(301, {
        'Expires': 0,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Location': '/'
      });
      res.end();
    } else if (req.url == "/mail") {
      // mail list to user
    }else {
      displayList(res);
    }
    } else if (req.method.toLowerCase() == 'post') {
    processForm(req, res);
    // displayList(res);
  }
});

function displayList(res) {
  res.writeHead(200, {
    'Expires': 0,
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Content-Type': 'text/html'
  });
  res.write('<html>\r\n<body>\r\n')
  res.write('<ul>\r\n');
  db.each("SELECT name from items", function(err, row) {
    if (err == null) {
      res.write('<li>'+row.name+'</li>\r\n');
    }
  });
  res.write('</ul>\r\n');
  fs.readFile('form.html',function (err, data) {
    res.write(data);
    res.end('</body>\r\n</html>');
  });

}
function processForm(req, res) {
  var form = new formidable.IncomingForm();
  form.parse(req, function (err, fields , files){
    insert(fields['item']);
  });
  res.writeHead(200, {
    'Refresh': '0'
  });
  res.end();
}
function insert(item) {
  let stmt = db.prepare("INSERT INTO items VALUES (?)");
  stmt.run(item);
  stmt.finalize();
}
function printDB() {
  db.each("SELECT name from items", function(err, row) {
    console.log(row.name);
  });
}

function clearDB() {
  db.serialize(function () {
    db.run("DROP TABLE IF EXISTS items");
    db.run("CREATE TABLE items (name TEXT)");
  });
}
server.listen(8080);
console.log("Listening..");
process.stdin.resume();
process.on('SIGINT', function () {
  console.log('\r\nClosing database..');
  db.close();
  process.exit();
});
