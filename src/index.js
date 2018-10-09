const openpgp = require('openpgp')
const btoa = require('btoa')

const AESCrypto = require('./AESCrypto')
const pgpCrypto = require('./PgpCrypto')
const { md5 } = require('./cryptoHelper')

const genFileKey = async () => btoa(await openpgp.crypto.random.getRandomBytes(32))

const genUserKey = async (name, email, numBits = 1024) =>
  await openpgp.generateKey({
    userIds: [{ name, email }],
    numBits
  })

const start = async () => {
  const stellarSecretUser1 = 'SBM5K26NZA33KHVIYUM7B5DZNLIJOIHXIVNNLRK3HXGEFIF5QIMYYHFE'
  const stellarSecretUser2 = 'SCOYZ2IAW4BVDPSSFQK2O327OJGYIWUAFYDC25HWLESIUP3JQBYGR4VJ'

  const masterkey = await genUserKey('master', 'master@example.com')
  const user1 = await genUserKey(md5(stellarSecretUser1), 'user1@example.com')
  const user2 = await genUserKey(md5(stellarSecretUser2), 'user2@example.com')
  const user3 = await genUserKey('user3', 'user3@example.com')

  const fileData = new Buffer("hello world!!", "utf8")
  const fileKey = await genFileKey()

  const aesCrypto = AESCrypto(fileKey)

  console.log('fileKey', '\n', fileKey)
  console.log('original content', '\n', fileData.toString())
  const encryptedFile = aesCrypto.encrypt(fileData)
  console.log('encrypted content', '\n', encryptedFile.toString('hex'))

  const encryptedFileKey = await pgpCrypto.encrypt(fileKey, masterkey, user1, user2)
  console.log('decrypted fileKey with master', '\n',
    (await pgpCrypto.decrypt(encryptedFileKey.data, masterkey)).toString())
  console.log('decrypted fileKey with user 1', '\n',
    (await pgpCrypto.decrypt(encryptedFileKey.data, user1)).toString())
  console.log('decrypted fileKey with user 2', '\n',
    (await pgpCrypto.decrypt(encryptedFileKey.data, user2)).toString())
  console.log('decrypted fileKey with user 3', '\n',
    (await pgpCrypto.decrypt(encryptedFileKey.data, user3).catch(_ => 'FAILED')).toString())

  const decryptedFileKey = await pgpCrypto.decrypt(encryptedFileKey.data, user1)
  const aesCrypto2 = AESCrypto(decryptedFileKey)
  const decryptedContent = await aesCrypto2.decrypt(encryptedFile)
  console.log('decrypted content', '\n', decryptedContent.toString())
}

start()
