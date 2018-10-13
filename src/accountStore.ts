import * as openpgp from 'openpgp'
import { PGPKey, savePGPKey } from './keyStore'
import { pgpCrypto } from './PgpCrypto'

const get = async (id): Promise<IAccount> => {
  const storedKey = await PGPKey.findOne({ id }).exec()
  if (!storedKey) {
    throw new Error(`Account not found: ${id}`)
  }

  return await pgpCrypto.toKeyPair(storedKey.privateKeyArmored)
}

const create = async (id): Promise<IAccount> => {
  const key = await pgpCrypto.genUserKey(id)
  await savePGPKey(id, key.publicKeyArmored, key.privateKeyArmored)
  return key
}

const getOrCreate = async (id): Promise<IAccount> => {
  const key = await get(id)
    .catch((err) => {
      console.error(id, err.message)
      return null
    })

  return key || await create(id)
}

export const accountStore: IAccountStore = {
  get,
  create,
  getOrCreate
}

export interface IAccountStore {
  get: (id: string) => Promise<IAccount>;
  create: (id: string) => Promise<IAccount>;
  getOrCreate: (id: string) => Promise<IAccount>;
}

export interface IAccount {
  id: number;
  userKey: string;
  publicKeyArmored: string;
  privateKeyArmored: string;
}
