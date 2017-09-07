var http = require('http');
var fs = require('fs');
var formidable = require('formidable');
const util = require('util');
const sqlite = require('sqlite3').verbose();
const Entities = require('html-entities').XmlEntities;
var db = new sqlite.Database("list.db");
clearDB();
var server = http.createServer(function (req, res) {
  if (req.method.toLowerCase() === 'get') {
    if (req.url === "/clear") {
      clearDB();
      res.writeHead(301, {
        'Expires': 0,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Location': '/'
      });
      res.end();
    } else if (req.url === "/mail") {
      // mail list to user
    } else if (req.url === "/"){
      displayList(res);
    }else {
      res.statusCode = 404;
      res.end();
    }
    } else if (req.method.toLowerCase() == 'post') {
      if(req.url === "/") {
        processForm(req, res);
      }
  }
});

function displayList(res) {
  res.writeHead(200, {
    'Expires': 0,
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Content-Type': 'text/html'
  });

  res.write(fs.readFileSync('res/header.html'));
  res.write('<ul class="list-group">\r\n');
  db.each("SELECT name from items", function(err, row) {
    if (err === null) {
      res.write('<li class="list-group-item">'+Entities.encode(row.name)+'</li>\r\n');
    }
  }, function (err, numrows) {
    res.write('</ul>\r\n');
    res.write(fs.readFileSync('res/form.html'));
    res.write(fs.readFileSync('res/footer.html'));
    res.end();
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
