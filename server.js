const http = require('http')
const fs = require('fs')
const formidable = require('formidable')
const sqlite = require('sqlite3').verbose()
const _url = require('url')
const Entities = require('html-entities').XmlEntities
const db = new sqlite.Database('list.db')
clearDB()
const server = http.createServer(function (req, res) {
  let requrl = _url.parse(req.url, true)
  if (req.method.toLowerCase() === 'get') {
    if (requrl.pathname === '/clear') {
      clearDB()
      res.writeHead(301, {
        'Expires': 0,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Location': '/'
      })
      res.end()
    } else if (req.url === '/mail') {
      // mail list to user
    } else if (requrl.pathname === '/') {
      displayList(res)
    } else if (requrl.pathname === '/delete') {
      if (Number.isInteger(parseInt(requrl.query.id))) {
        deleteFromDB(requrl.query.id, function () {
          res.writeHead(301, {
            'Location': '/'
          })
          res.end()
        })
      } else {
        displayList(res, 'The ID supplied as GET-Parameter was not parseable as an integer.')
      }
    } else {
      res.statusCode = 404
      res.end()
    }
  } else if (req.method.toLowerCase() === 'post') {
    if (req.url === '/') {
      processForm(req, res)
    }
  }
})

function displayList (res, err) {
  res.writeHead(200, {
    'Expires': 0,
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Content-Type': 'text/html'
  })

  res.write(fs.readFileSync('res/header.html'))
  if (err != null) {
    res.write(fs.readFileSync('res/errormessage.html', {encoding: 'UTF8'}).replace('{{msg}}', err))
  }
  res.write('<ul class="list-group">\r\n')
  db.each('SELECT name,id from items', function (err, row) {
    if (err === null) {
      res.write('<li class="list-group-item justify-content-between">' + Entities.encode(row.name) + ' <a href="/delete?id=' + row.id + '"><span class="btn btn-sm btn-danger">Remove</span></a></li>\r\n')
    }
  }, function (numrows) {
    res.write('</ul>\r\n')
    res.write(fs.readFileSync('res/form.html'))
    res.write(fs.readFileSync('res/footer.html'))
    res.end()
  })
}
function processForm (req, res) {
  const form = new formidable.IncomingForm()
  form.parse(req, function (err, fields, files) {
    if (!err) {
      insert(fields['item'])
    } else {
      console.error(err)
    }
  })
  res.writeHead(200, {
    'Refresh': '0'
  })
  res.end()
}
function insert (item) {
  let stmt = db.prepare('INSERT INTO items(name) VALUES (?)')
  stmt.run(item)
  stmt.finalize()
}
function clearDB () {
  db.serialize(function () {
    db.run('DROP TABLE IF EXISTS items')
    db.run('CREATE TABLE items (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)')
  })
}
function deleteFromDB (id, callback) {
  // for now if id doesn't exist just refresh
  let stmt = db.prepare('DELETE FROM items where id=(?)')
  stmt.run(id)
  stmt.finalize()
  callback()
}
server.listen(8080)
console.log('Listening..')
process.stdin.resume()
process.on('SIGINT', function () {
  console.log('\r\nClosing database..')
  db.close()
  process.exit()
})
