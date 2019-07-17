import { Account, FileKey } from '../models'

const list = async () => {
  //
}

const getById = async (id: number) => {
  return await FileKey.findByPk(id)
}

const create = async (encryptedValue: string, ownerId: number) => {
  return await FileKey.create<FileKey>({ encryptedValue, ownerId })
}

const update = async (id: number, newEncryptedValue: string) => {
  const filekey = await getById(id)
  return filekey != null
    ? filekey.update({ encryptedValue: newEncryptedValue })
    : null
}

const doDelete = async () => {
  //
}

export default {
  list,
  getById,
  create,
  update,
  delete: doDelete
}
