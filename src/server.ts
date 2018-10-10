import * as crypto from 'crypto'
import * as fs from 'fs'
import * as http from 'http'
import * as path from 'path'
import AESCrypto from './AESCrypto'

const encrypter = () => AESCrypto('password1').encryptStream()
const decrypter = () => AESCrypto('password1').decryptStream()

const orgVdoPath = path.join(process.cwd(), 'public', 'assets', 'video.mp4')
const vdoPath = path.join(process.cwd(), 'public', 'assets', 'video.mp4.enc')
// const mp4Crypto = AESCrypto('password1')
// const video = fs.readFileSync(orgVdoPath)
const video = fs.readFileSync(orgVdoPath)
// const encryptedVideo = encrypter()(video)
const cipher = encrypter()
const encryptedVideo = Buffer.concat([cipher.update(video), cipher.final()])
// const encryptedVideo = mp4Crypto.encrypt(video)
fs.writeFileSync(vdoPath, encryptedVideo)

// const mp4Crypto = AESCrypto('password1')
// const dvideo = fs.readFileSync(vdoPath)
// const decryptedVideo = mp4Crypto.decrypt(dvideo)
// fs.writeFileSync(vdoPath + '.mp4', decryptedVideo)

const port = 1337

http.createServer((req, res) => {
  const stat = fs.statSync(vdoPath)
  const total = stat.size
  // const decrypt = AESCrypto('password1').decryptStream()
  if (req.headers.range) {
    const range = req.headers.range
    const parts = (range as string).replace(/bytes=/, '').split('-')
    const partialstart = parts[0]
    const partialend = parts[1]

    const start = parseInt(partialstart, 10)
    const end = partialend
      ? parseInt(partialend, 10)
      : total - 1
    const chunksize = (end - start) + 1
    console.log(`RANGE: ${total} / ${start}-${end}=${chunksize}`)

    const head = {
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Range': `bytes ${start}-${end}/${total}`,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(206, head)

    const encStream = fs.createReadStream(vdoPath, { start, end })
    .pipe(decrypter())
    encStream.pipe(res)

    encStream.on('close', () => console.log('encStream', 'closed'))
    encStream.on('error', (err) => {console.log('encStream: ', err.message); res.end()})
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
