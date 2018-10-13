import { File, FileKey } from '../models'

const list = async () => {
  //
}

const getById = async (id: string, scope: string = null as any) => {
  // return File.findById(id, {include: [FileKey]})
  return File.scope(scope).findById(id)
}

const getByFullPath = async (fullPath: string): Promise<File | null> => {
  return await File.findOne({ where: { fullPath } })
}

const create = async (
  ipfsHash: string,
  ipfsPath: string,
  size: number,
  fullPath: string,
  ownerId: number,
  fileKeyId?: number
) => {
  return await File.create<File>({
    ipfsHash,
    ipfsPath,
    size,
    fullPath,
    ownerId,
    fileKeyId,
  })
}

const update = async () => {
  //
}

const doDelete = async () => {
  //
}

export default {
  list,
  getById,
  getByFullPath,
  create,
  update,
  delete: doDelete
}
