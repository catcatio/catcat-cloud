// tslint:disable-next-line:no-var-requires
const btoa = require('btoa')
import * as crypto from 'crypto'
import * as openpgp from 'openpgp'

const encrypt = async (data, masterkey, ...userKeys) => {
  let publicKeys = []
  userKeys.push(masterkey)
  for (const key of userKeys) {
    publicKeys = publicKeys.concat((await openpgp.key.readArmored(key.publicKeyArmored)).keys)
  }

  const privateKeys = (await openpgp.key.readArmored(masterkey.privateKeyArmored)).keys
  const encryptedData = await openpgp.encrypt({
    message: openpgp.message.fromText(data),
    publicKeys,
    privateKeys,
  })
  return (encryptedData as openpgp.EncryptArmorResult).data
}

const decrypt = async (encryptedText, user) => {
  const privateKeyArmored = `${user.privateKeyArmored}`
  const prikeys = (await openpgp.key.readArmored(privateKeyArmored)
    .catch((error) => {
      console.error(error.message)
      console.log(user.privateKeyArmored)
      return null
    })).keys
  const decryptedFileKey = await openpgp.decrypt({
    message: await openpgp.message.readArmored(encryptedText),
    privateKeys: prikeys,
  })
  return decryptedFileKey.data
}

const genUserKey = async (name, email, numBits = 1024) =>
  await openpgp.generateKey({
    userIds: [{ name, email }],
    numBits,
  })

const toKeyPair = async (privateKeyArmored) => {
  const loadedKey = await openpgp.key.readArmored(privateKeyArmored)
  const key = loadedKey.keys[0]

  // return the same interface as generateKey
  return {
    key,
    privateKeyArmored: key.armor(),
    publicKeyArmored: key.toPublic().armor(),
  }
}

const genFileKey = async (length = 32) => btoa(crypto.randomBytes(length))

export {
  encrypt,
  decrypt,
  genUserKey,
  toKeyPair,
  genFileKey,
}
