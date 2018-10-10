const http = require('http'),
  fs = require('fs'),
  path = require('path'),
  crypto = require('crypto'),
  AESCrypto = require('./AESCrypto')

const encrypter = () => AESCrypto('password1').encryptStream()
const decrypter = () => AESCrypto('password1').decryptStream()

var orgVdoPath = path.join(process.cwd(), 'public', 'assets', 'video.mp4')
var vdoPath = path.join(process.cwd(), 'public', 'assets', 'video.mp4.enc')
// const mp4Crypto = AESCrypto('password1')
// const video = fs.readFileSync(orgVdoPath)
const video = fs.readFileSync(orgVdoPath)
// const encryptedVideo = encrypter()(video)
const cipher = encrypter()
var encryptedVideo = Buffer.concat([cipher.update(video), cipher.final()]);
// const encryptedVideo = mp4Crypto.encrypt(video)
fs.writeFileSync(vdoPath, encryptedVideo)

// const mp4Crypto = AESCrypto('password1')
// const dvideo = fs.readFileSync(vdoPath)
// const decryptedVideo = mp4Crypto.decrypt(dvideo)
// fs.writeFileSync(vdoPath + '.mp4', decryptedVideo)

const port = 1337


http.createServer((req, res) => {
  var stat = fs.statSync(vdoPath)
  var total = stat.size
  // const decrypt = AESCrypto('password1').decryptStream()
  if (req.headers['range']) {
    var range = req.headers.range
    var parts = range.replace(/bytes=/, '').split('-')
    var partialstart = parts[0]
    var partialend = parts[1]

    var start = parseInt(partialstart, 10)
    var end = partialend
      ? parseInt(partialend, 10)
      : total - 1
    var chunksize = (end - start) + 1
    console.log(`RANGE: ${total} / ${start}-${end}=${chunksize}`)

    const head = {
      'Content-Range': `bytes ${start}-${end}/${total}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4'
    }
    res.writeHead(206, head)

    const encStream = fs.createReadStream(vdoPath, { start, end })
    .pipe(decrypter())
    encStream.pipe(res)

    encStream.on('close', () => console.log('encStream', 'closed'))
    encStream.on('error', (err) => console.log('encStream: ', err.message), res.end())
  } else {
    console.log('ALL: ' + total)

    const head = {
      'Content-Length': total,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(200, head)
    const allStream = fs.createReadStream(vdoPath)
      .pipe(decrypter())
      .pipe(res)

    allStream.on('close', () => console.log('allstream', 'closed'))
  }
}).listen(port, '127.0.0.1')

console.log(`Server running at http://127.0.0.1:${port}/`)