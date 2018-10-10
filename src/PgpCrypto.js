const openpgp = require('openpgp')
const btoa = require('btoa')

const encrypt = async (data, masterkey, ...userKeys) => {
  let keys = []
  userKeys.push(masterkey)
  for (let index = 0; index < userKeys.length; index++) {
    keys = keys.concat((await openpgp.key.readArmored(userKeys[index].publicKeyArmored)).keys)
  }

  const privateKeys = (await openpgp.key.readArmored(masterkey.privateKeyArmored)).keys
  const encryptedData = await openpgp.encrypt({
    message: await openpgp.message.fromText(data),
    publicKeys: keys,
    privateKeys
  })
  return encryptedData
}

const decrypt = async (encryptedText, user) => {
  const prikeys = (await openpgp.key.readArmored(user.privateKeyArmored)).keys
  const decryptedFileKey = await openpgp.decrypt({
    message: await openpgp.message.readArmored(encryptedText),
    privateKeys: prikeys,
  })
  return decryptedFileKey.data
}

const genUserKey = async (name, email, numBits = 1024) =>
  await openpgp.generateKey({
    userIds: [{ name, email }],
    numBits
  })

const toKeyPair = async (privateKeyArmored) => {
  const loadedKey = await openpgp.key.readArmored(privateKeyArmored)
  const key = loadedKey.keys[0]
  const revocationCertificate = await key.getRevocationCertificate();
  key.revocationSignatures = [];

  // return the same interface as generateKey
  return {
    key,
    revocationCertificate,
    privateKeyArmored: key.armor(),
    publicKeyArmored: key.toPublic().armor(),
  }
}

const genFileKey = async (length = 32) => btoa(await openpgp.crypto.random.getRandomBytes(length))

module.exports = {
  encrypt,
  decrypt,
  genUserKey,
  toKeyPair,
  genFileKey
}