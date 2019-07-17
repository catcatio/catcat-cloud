import { File, FileKey } from '../models'

const list = async () => {
  //
}

const getById = async (id: string, scope: string = null as any) => {
  // return File.findByPk(id, {include: [FileKey]})
  return File.scope(scope).findByPk(id)
}

const create = async (
  ipfsHash: string,
  ipfsPath: string,
  size: number,
  filename: string,
  mimetype: string,
  ownerId: number,
  fileKeyId?: number
) => {
  return await File.create<File>({
    ipfsHash,
    ipfsPath,
    size,
    filename,
    mimetype,
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
  create,
  update,
  delete: doDelete
}
