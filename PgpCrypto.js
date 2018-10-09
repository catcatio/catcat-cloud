const openpgp = require('openpgp')

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

module.exports = {
  encrypt,
  decrypt
}