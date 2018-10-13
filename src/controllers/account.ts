import { IAccount } from '../accountStore'
import { Account } from '../models'

const toIAccount = (account: Account): IAccount => {
  return {
    id: account.id,
    userKey: account.userKey,
    privateKeyArmored: account.privateKeyArmored,
    publicKeyArmored: account.publicKeyArmored
  }
}

const getById = async (id: number, scope: string = null as any): Promise<IAccount | null> => {
  const account = await Account.scope(scope).findById(id)
  return account ? toIAccount(account) : null
}

const getByUserKey = async (userKey: string, scope: string = null as any): Promise<Account | null> => {
  return await Account.scope(scope).findOne({ where: { userKey } })
}

const create = async (userKey: string, publicKeyArmored: string, privateKeyArmored: string): Promise<Account> => {
  return await Account.create<Account>({
    userKey,
    publicKeyArmored,
    privateKeyArmored
  }).catch(error => {
    console.error(error)
    throw error
  })
}

const update = async (id) => {
  //
}

const doDelete = async () => {
  //
}

export default {
  getById,
  getByUserKey,
  create,
  update,
  delete: doDelete
}
