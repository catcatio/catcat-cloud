const crypto = require('crypto')

const md5 = (dataStr) => crypto
  .createHash('md5')
  .update(dataStr, 'utf-8')
  .digest('hex')
  .toUpperCase()


module.exports = {
  md5
}