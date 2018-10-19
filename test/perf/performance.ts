import { writeFileSync } from 'fs'
import * as path from 'path'
import { pgpCrypto } from '../../src/PgpCrypto'

const init = (len) => {
  len = len < 0 ? 0 : len
  return Array.from(Array(len))
}

const random = (len) => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  return init(len).map(() => possible.charAt(Math.floor(Math.random() * possible.length))).join('')
}

const genUserKeys = async (count) => {
  return Promise.all(init(count).map(key => pgpCrypto.genUserKey(random(5))))
}

const saveUserKeys = async (filename, userKeys) => {
  writeFileSync(filename, JSON.stringify(userKeys.map(u => ({
    publicKeyArmored: u.publicKeyArmored,
    privateKeyArmored: u.privateKeyArmored
  })), null, 2))
}

const masterAccount = {
  publicKeyArmored: '-----BEGIN PGP PUBLIC KEY BLOCK-----\r\nVersion: OpenPGP.js v4.1.1\r\nComment: https://openpgpjs.org\r\n\r\nxo0EW8mVsAED/242xYcC6qJSsN7WmE4yXU0DnUgN2d0Y+SECkWzom8hSzVpm\r\nEDvhRK51K19rf3ubHhK+qJAHGBZBJD1SHdVnlfl9JjyL0KHqzWyghp4W6h++\r\nwQ2UXbWBS32Rgo2/OXq9EV+3j4vucvEBuMSz8SLcm68sZJw+M71ejl45o2H6\r\n7WXJABEBAAHNBU1EYXBJwrUEEAEIACkFAlvJlbAGCwkHCAMCCRB+nifFpkhE\r\n3AQVCAoCAxYCAQIZAQIbAwIeAQAAEmoD/ijE3NmGHkJk96QvOf8ZggmeW+Dn\r\nnbr4fygn9RFT38KlGTPFFagf1LXrCS3V5X7FascqJSCNj5Wi4dBVXnz15cAw\r\nqgBemcoAZDvnwSZ9ix0zrW1wzFbb9OnkoUGvySg0rKD37m0TMYCTUbMbPmMY\r\nH5deyHF9AruBgM/rUkxlnjT/zo0EW8mVsAEEANBOwLHaTzwjj3ymRWTEd8Wg\r\nbBjJvACxr7GwlE6/f9M+MD0pjlc9DhLDlP2xZJ9pNcaQA5sgEEm7O51/QvZi\r\nLD85ECooD+RnaQGxIq8UiNY1WK2Sq3wV8YCIfLFcUwCSouwDmff8sDG1XHh8\r\nBjHcWb5imZWaKQ6a+kehAJd6rhwDABEBAAHCnwQYAQgAEwUCW8mVsAkQfp4n\r\nxaZIRNwCGwwAAKU7A/9FlMhiBGC0kCDtISl2g3Wt0ppAzcZice35CAdan+0A\r\nDz16mfDGwAF87wVnzD6dWCeyMl8Q3+z7RbwAMW/gdSU9sViysu4Aqex+16uY\r\nTJ65yEmNUy5jkBf38rh0Cozj962cUbMTfWXERNYr+9kbLciwUIjyPa6oYeNS\r\nnLXfKY9PrA==\r\n=d4VY\r\n-----END PGP PUBLIC KEY BLOCK-----\r\n',
  privateKeyArmored: '-----BEGIN PGP PRIVATE KEY BLOCK-----\r\nVersion: OpenPGP.js v4.1.1\r\nComment: https://openpgpjs.org\r\n\r\nxcEYBFvJlbABA/9uNsWHAuqiUrDe1phOMl1NA51IDdndGPkhApFs6JvIUs1a\r\nZhA74USudStfa397mx4SvqiQBxgWQSQ9Uh3VZ5X5fSY8i9Ch6s1soIaeFuof\r\nvsENlF21gUt9kYKNvzl6vRFft4+L7nLxAbjEs/Ei3JuvLGScPjO9Xo5eOaNh\r\n+u1lyQARAQABAAP/afRF2RG4t+x/FPuA2Ewa3hsHbWnDdIa5mj55yBWnDeJs\r\ngOd129sox/7kf4s8t3vcYXDhY/Ut9tcRG9KB09MNncz0EAFxscpGv5LVZk5Y\r\nRtkbP/ZP+HDiMEFgBVaCJ9h9M41kQ+PwimB/z3cM5U/eXUXMT+mRnF8TrcLW\r\nRdNISsECANHJ8c0KAdSn+6F4Z028E7qWkSplkZuNHvOmprrc1Fvg0PtvzYwv\r\nq4bWbKTs49ab5CszB5gNgH3XI82PquDQvrUCAIZ9xOVrH9nYfhLQrP6XwE3y\r\nHdDE9vyyxtDkYBt97SaDJ6HHWuHthxrq/Z2eTmlvm8oKgGw3u/09S5df7C2C\r\nY0UB/iO04NrYoHQ73MlsV+jGRfX/5F4PO0rOC7eYsuhbFbKtdq1H7HFfTTYu\r\nLBFEgfxWlGnGFzf++eQLhueVtZUzGCixRs0FTURhcEnCtQQQAQgAKQUCW8mV\r\nsAYLCQcIAwIJEH6eJ8WmSETcBBUICgIDFgIBAhkBAhsDAh4BAAASagP+KMTc\r\n2YYeQmT3pC85/xmCCZ5b4Oeduvh/KCf1EVPfwqUZM8UVqB/UtesJLdXlfsVq\r\nxyolII2PlaLh0FVefPXlwDCqAF6ZygBkO+fBJn2LHTOtbXDMVtv06eShQa/J\r\nKDSsoPfubRMxgJNRsxs+Yxgfl17IcX0Cu4GAz+tSTGWeNP/HwRgEW8mVsAEE\r\nANBOwLHaTzwjj3ymRWTEd8WgbBjJvACxr7GwlE6/f9M+MD0pjlc9DhLDlP2x\r\nZJ9pNcaQA5sgEEm7O51/QvZiLD85ECooD+RnaQGxIq8UiNY1WK2Sq3wV8YCI\r\nfLFcUwCSouwDmff8sDG1XHh8BjHcWb5imZWaKQ6a+kehAJd6rhwDABEBAAEA\r\nBAC1qZh/AoZLSi/eYxrtkDFr1kWvMG+Wo183tWkBbBxL21YyYMVT61kUoCCV\r\nRlkcdKKDMiES7dmGk5Sf+9YoDOHMBQMiuJBdDhu5GyPco8bfKQWV6yVkbr6L\r\nb2git5ibHdnZ5TLIjSKJd1pWo6VNI6bRKrMAYQWkOWs/3AGS+u72EQIA+x9I\r\nnyw3TT24rW/NceGinacZNn4pzq10ZeoHELDzm+Fl1C/UNVxyJVafubHFyAs2\r\nYP1JJh+ySIvmKjVSZzxC/wIA1FqSWFlDkBwmN3tpseb657t5ZHdtC4cd9lIx\r\nLln8vQrktT90bh2xBho6DgSwsf15LHBvKE2rskKNHKrmNK4a/QH+PbNAr5ag\r\n7J2YdeBRfA+7Dre70L9ia+Fv58M044i0bHZVKbUdEEHgBOLnrQrmRy2EzSoV\r\nnJKXYXfyvW/vA3PLfZkHwp8EGAEIABMFAlvJlbAJEH6eJ8WmSETcAhsMAACl\r\nOwP/RZTIYgRgtJAg7SEpdoN1rdKaQM3GYnHt+QgHWp/tAA89epnwxsABfO8F\r\nZ8w+nVgnsjJfEN/s+0W8ADFv4HUlPbFYsrLuAKnsftermEyeuchJjVMuY5AX\r\n9/K4dAqM4/etnFGzE31lxETWK/vZGy3IsFCI8j2uqGHjUpy13ymPT6w=\r\n=H8oX\r\n-----END PGP PRIVATE KEY BLOCK-----\r\n'
}

const ownerAccount = {
  publicKeyArmored: '-----BEGIN PGP PUBLIC KEY BLOCK-----\r\nVersion: OpenPGP.js v4.1.1\r\nComment: https://openpgpjs.org\r\n\r\nxo0EW8mVsAED/22K/rz01rA3XCzISFmKGE9dNwYZTnwQd8jAy37/U80OqCw6\r\nRtI4iDbdLLhMXcZePJi1xTo/seN+J4FHsjLxqN6r0m6eDEgNJLHCBZTxncQ+\r\nEUs03OwTkr4eBPOUMeXr2igdrffPIwNMI4J2qqXkK7xX4eakYUa+S42pNfKY\r\n70MHABEBAAHNBVhJckRqwrUEEAEIACkFAlvJlbAGCwkHCAMCCRA32ky7B1vx\r\nlgQVCAoCAxYCAQIZAQIbAwIeAQAAZ4YD/ioSynX8Wai/dSX5GRe8VwF40A/4\r\nEp3AmywTC1MftVBBloLgbPPO2iLx9u89w6Nh4aZK5465OrajP83X3D/QSi5N\r\nWkrr1GW2cu9bqrF0gvO5bx44BfgjdgZELE4Da6zih/d15Cw5j66F+iUOLDRf\r\nnPmoQWqNDNOdA/WKDhTwcq/uzo0EW8mVsAED/18CZ36bvm3YUdxUBY1ArSoR\r\nJ329sipOLwctN42bda/XduJKfyLgOZDYGVYNj6yznRJUYdppDMRwGaw1Zv0T\r\n9T6E6q7Mk4Ap5RBScICziswEhTMs3Jsn0mTB/ujTLJs59Xohoeey2pwCiRhv\r\n+hJqlm7NYHvgMnzRbBpJX3NWtysVABEBAAHCnwQYAQgAEwUCW8mVsAkQN9pM\r\nuwdb8ZYCGwwAAOekA/9A8Uw1wxAvy3u/urOciN4m8unLtSkIldeAQ/6tkyWX\r\nopuO+w+UjotjmSwaBTRbTYUgxI/bEuU2g55iDVUZA8Ni/5GEwZqiAT35Hfz0\r\nVEHDtQ4jMRac2K9n0HiwoH571bwTieqgKgVax9hdroLaE7BAo/GTug7g6IXf\r\nswaqwTEoKQ==\r\n=A6r2\r\n-----END PGP PUBLIC KEY BLOCK-----\r\n',
  privateKeyArmored: '-----BEGIN PGP PRIVATE KEY BLOCK-----\r\nVersion: OpenPGP.js v4.1.1\r\nComment: https://openpgpjs.org\r\n\r\nxcEYBFvJlbABA/9tiv689NawN1wsyEhZihhPXTcGGU58EHfIwMt+/1PNDqgs\r\nOkbSOIg23Sy4TF3GXjyYtcU6P7HjfieBR7Iy8ajeq9JungxIDSSxwgWU8Z3E\r\nPhFLNNzsE5K+HgTzlDHl69ooHa33zyMDTCOCdqql5Cu8V+HmpGFGvkuNqTXy\r\nmO9DBwARAQABAAP/Rrb62Xpo+VrTiylD42GNbfZr5ekCTH7JBPTIqVQkgfSb\r\nRenc/Cp4bIp9KwBJbRw6nA6DoqWprYUr9X4WIGL2subLxNhNpCngjpwCmQoz\r\nFmU8ghXlx4NUqZw6PvFZNbpHqwsrPJCNGX2kKLMFDyG2/LD7KsmhJB5otocC\r\nhsf2DRECALr/X+MQSS6jISPN6iahLDSHkc3yWwxUa7fCg1xkNFAj26WsXsUg\r\n/VBjyKpQC7ENwNjiMYQ2W+Ksc18xK/Eq2+kCAJX26XSsvJVSI+VpkD+VMlw2\r\np28iZY0XNu20xvShXRdCWnc64mJ4OTgGb5A7iRnUSOOAO3o4HDHJ80SSik/O\r\nAW8B/3o16fjRfyKntSVUjwZXmb0CwGUNRX/T9HRuTAsWBke2ZeE6E3OcyESA\r\nfdDLloo2Wyo4IFSBdkphtUuaWMO1veGbHs0FWElyRGrCtQQQAQgAKQUCW8mV\r\nsAYLCQcIAwIJEDfaTLsHW/GWBBUICgIDFgIBAhkBAhsDAh4BAABnhgP+KhLK\r\ndfxZqL91JfkZF7xXAXjQD/gSncCbLBMLUx+1UEGWguBs887aIvH27z3Do2Hh\r\npkrnjrk6tqM/zdfcP9BKLk1aSuvUZbZy71uqsXSC87lvHjgF+CN2BkQsTgNr\r\nrOKH93XkLDmProX6JQ4sNF+c+ahBao0M050D9YoOFPByr+7HwRgEW8mVsAED\r\n/18CZ36bvm3YUdxUBY1ArSoRJ329sipOLwctN42bda/XduJKfyLgOZDYGVYN\r\nj6yznRJUYdppDMRwGaw1Zv0T9T6E6q7Mk4Ap5RBScICziswEhTMs3Jsn0mTB\r\n/ujTLJs59Xohoeey2pwCiRhv+hJqlm7NYHvgMnzRbBpJX3NWtysVABEBAAEA\r\nA/4g9GiJleP7nejnD43NbP2jdcfI6Z9+5ReS2bBHQgEUORxXaZentTbCcvJ2\r\n0sVfFf4JeZNnesCe8nM1NGDAr8eEt3+F7GDSdjAU+zPP2ITUSnkrOY1OGOo2\r\nFUNDO0oB+RDPEkMYaT5UC9Yq/YZg67prXamfuXVPEZLL9hu5ViZJkQIAqBCj\r\noG/ExqQclHXY+ukJe723vlg1ZNWP40nOlhr2oWcCIMEZR8Z6mu2jHtOUcLXI\r\nwUoNfAw3bCrULQR8y/jmhwIAkLhgt5Kx5N6I2sFGxvL4SGQinTl9KTHoYY2A\r\nPYzr3sC9QCTuiF+GJk9MMWCHl6NlOWS05kcPIH4o3YTRT/YsgwIAhtyxiMvY\r\nl0bvPfq99vYT6vLfldOA5isR9zVqYgOdfRwljv6de2LCKtq51/Ikxz9WSrZq\r\nEbdej4QPUDGCr6pd+6cIwp8EGAEIABMFAlvJlbAJEDfaTLsHW/GWAhsMAADn\r\npAP/QPFMNcMQL8t7v7qznIjeJvLpy7UpCJXXgEP+rZMll6KbjvsPlI6LY5ks\r\nGgU0W02FIMSP2xLlNoOeYg1VGQPDYv+RhMGaogE9+R389FRBw7UOIzEWnNiv\r\nZ9B4sKB+e9W8E4nqoCoFWsfYXa6C2hOwQKPxk7oO4OiF37MGqsExKCk=\r\n=JT6R\r\n-----END PGP PRIVATE KEY BLOCK-----\r\n'
}

const start = async () => {
  let startTime = 0
  let endTime = 0

  // const masterAccount = await pgpCrypto.genUserKey(random(5))
  // const ownerAccount = await pgpCrypto.genUserKey(random(5))

  // const userCount = 2
  // startTime = Date.now()
  // const userKeys = await genUserKeys(userCount)
  // endTime = Date.now()
  // console.log(`${userCount} users generated in ${(endTime - startTime) / 1000} s`)
  // saveUserKeys(`users${userCount}.json`, userKeys)

  const userKeys = require(path.join(__dirname, 'users240.json'))

  startTime = Date.now()
  const fileKey = pgpCrypto.genFileKey()
  console.log(`${fileKey}`)
  const encryptedFileKey = await pgpCrypto.encrypt(fileKey, masterAccount, ownerAccount, ...userKeys)
  endTime = Date.now()
  console.log(`fileKey encrypted in ${(endTime - startTime) / 1000} s`)

  startTime = Date.now()
  const decryptedFileKey = await pgpCrypto.decrypt(encryptedFileKey, masterAccount)
  endTime = Date.now()
  console.log(`${decryptedFileKey}`)
  console.log(`fileKey decrypted in ${(endTime - startTime) / 1000} s`)
}

start()

/** 240 users
 * BJh1g4akL092+JDRAxzEfV2L1rS0b3ggXbhgy0UNdnM=
 * fileKey encrypted in 1.404 s
 * BJh1g4akL092+JDRAxzEfV2L1rS0b3ggXbhgy0UNdnM=
 * fileKey decrypted in 0.066 s
 */
