const http = require('http'),
  fs = require('fs'),
  util = require('util'),
  AESCrypto = require('./AESCrypto')

http.createServer((req, res) => {
  var path = 'video.mp4.enc'
  var stat = fs.statSync(path)
  var total = stat.size
  const decrypt = AESCrypto('password1').decryptStream()

  if (req.headers['range']) {
    var range = req.headers.range
    var parts = range.replace(/bytes=/, "").split("-")
    var partialstart = parts[0]
    var partialend = parts[1]

    var start = parseInt(partialstart, 10)
    var end = partialend ? parseInt(partialend, 10) : total - 1
    var chunksize = (end - start) + 1
    console.log('RANGE: ' + start + ' - ' + end + ' = ' + chunksize)

    var file = fs.createReadStream(path, { start: start, end: end })
    res.writeHead(206, { 'Content-Range': 'bytes ' + start + '-' + end + '/' + total, 'Accept-Ranges': 'bytes', 'Content-Length': chunksize, 'Content-Type': 'video/mp4' })
    const encStream = file.pipe(decrypt)
    encStream.pipe(res)

    encStream.on('close', () => {
      console.log('encStream', 'closed')
    })

    encStream.on('error', (err) => {
      console.log('encStream', err)
      res.end()
    })
  } else {
    console.log('ALL: ' + total)
    res.writeHead(200, { 'Content-Length': total, 'Content-Type': 'video/mp4' })
    const allStream = fs.createReadStream(path).pipe(decrypt).pipe(res)
    allStream.on('close', () => {
      console.log('allstream', 'closed')

    })
  }
}).listen(1337, '127.0.0.1')

console.log('Server running at http://127.0.0.1:1337/')