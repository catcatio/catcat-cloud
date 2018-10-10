import * as crypto from 'crypto'
import { md5 } from './cryptoHelper'

export default (passphrase, cipherAlgorithm = 'aes-256-cbc') => {
  const IV_LENGTH = 16

  const passphrase_hash = md5(passphrase)
  const iv = new Buffer(passphrase_hash).slice(0, IV_LENGTH)
  const encrypt = (buffer) => {
    var cipher = crypto.createCipheriv(cipherAlgorithm, passphrase_hash, iv)
    var crypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
    return crypted
  }

  const decrypt = (buffer) => {
    var decipher = crypto.createDecipheriv(cipherAlgorithm, passphrase_hash, iv)
    var dec = Buffer.concat([decipher.update(buffer), decipher.final()]);
    return dec;
  }

  const encryptStream = () => {
    return crypto.createCipheriv(cipherAlgorithm, passphrase_hash, iv)
  }

  const decryptStream = () => {
    return crypto.createDecipheriv(cipherAlgorithm, passphrase_hash, iv)
  }

  return {
    encrypt,
    decrypt,
    encryptStream,
    decryptStream
  }
}