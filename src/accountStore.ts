import { PGPKey, savePGPKey } from './keyStore'
import * as pgpCrypto from './PgpCrypto'

export const get = async (name) => {
  const storedKey = await PGPKey.findOne({ name }).exec()
  if (!storedKey) {
    throw new Error(`Account not found: ${name}`)
  }

  return await pgpCrypto.toKeyPair(storedKey.privateKeyArmored)
}

export const create = async (name, email = null) => {
  const key = await pgpCrypto.genUserKey(name, email)
  await savePGPKey(name, email, key.publicKeyArmored, key.privateKeyArmored)
  return key
}

export const getOrCreate = async (name, email = null) => {
  const key = await get(name)
    .catch((err) => {
      console.error(name, err.message)
      return null
    })

  return key || await create(name, email)
}
