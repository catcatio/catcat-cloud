import { PGPKey, savePGPKey } from './keyStore'
import * as pgpCrypto from './PgpCrypto'

export const queryOrCreate = async (name, email = null) => {
  const key = await PGPKey.findOne({ name }).exec()
    .then(async (storedKey) => {
      // console.log('privateKeyArmored', storedKey.privateKeyArmored)
      return !storedKey ? null : await pgpCrypto.toKeyPair(storedKey.privateKeyArmored)
        .catch((error) => {
          console.error(name, error.message)
          return null
        })
    })
    .catch((err) => {
      console.error(name, err.message)
      return null
    })

  return key || await pgpCrypto.genUserKey(name, email).then(async (userKey) => {
    await savePGPKey(name, email, userKey.publicKeyArmored, userKey.privateKeyArmored)
    return key
  })
}
