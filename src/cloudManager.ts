import { default as AesCrypto } from './AESCrypto'
import { IIpfsStore } from './ipfsStore'
import { IPgpCrypto } from './PgpCrypto'

import accountController from './controllers/account'
import fileController from './controllers/file'
import fileKeyController from './controllers/filekey'

import { Account, FileKey } from './models'

export const CloudManager = (
  pgpCrypto: IPgpCrypto,
  masterAccountUserKey: string,
  ipfsStore: IIpfsStore) => {

  let internalMasterAccount: Account
  const getMasterAccount = async () => internalMasterAccount ||
    (internalMasterAccount = await getOrCreateUser(masterAccountUserKey))

  const getOrCreateUser = async (userKey) => {
    const account = await accountController.getByUserKey(userKey)

    if (account) {
      return account
    }

    const key = await pgpCrypto.genUserKey(userKey)
    const newAccount = await accountController.create(
      userKey,
      key.publicKeyArmored,
      key.privateKeyArmored
    )

    return newAccount
  }

  const uploadFile = async (
    content: NodeJS.ReadableStream,
    fullPath: string,
    isPublic: boolean,
    ownerUserKey: string) => {

    // get or create account
    const masterAccount = await getMasterAccount()
    const ownerAccount = await getOrCreateUser(ownerUserKey)
    if (!ownerAccount) {
      throw new Error(`uploadNewFile: Failed to getOrCreateUser ${ownerUserKey}`)
    }

    // encrypt file
    let storedFileKey: FileKey
    let ipfsResult: any
    if (!isPublic) {
      const fileKey = pgpCrypto.genFileKey()
      const encryptedFileKey = await pgpCrypto.encrypt(fileKey, masterAccount, ownerAccount)
      storedFileKey = await fileKeyController.create(encryptedFileKey, ownerAccount.id)

      const fileEnscryptor = AesCrypto(fileKey)
      const encryptedFileStream = content.pipe(fileEnscryptor.encryptStream())
      ipfsResult = await ipfsStore.add(encryptedFileStream)
    } else {
      storedFileKey = null as any
      ipfsResult = await ipfsStore.add(content)
    }

    // store file
    const storedFile = await fileController.create(
      ipfsResult[0].hash,
      ipfsResult[0].path,
      ipfsResult[0].size,
      fullPath,
      ownerAccount.id,
      storedFileKey ? storedFileKey.id : undefined)

    return {
      hash: ipfsResult[0].hash,
      path: ipfsResult[0].path,
      size: ipfsResult[0].size,
      fileId: storedFile.id
    }
  }

  const downloadFile = async (fileId, downloaderUserKey) => {
    const downloadAccount = await getOrCreateUser(downloaderUserKey)
    const MemoryStream = require('memory-stream')
    const ms = new MemoryStream()

    const file = await fileController.getById(fileId, 'full')
    if (!file) {
      throw new Error('File not found')
    }

    if (!file.fileKeyId) {
      const ipfsGetResult = (await ipfsStore.get(`/ipfs/${file.ipfsHash}`))
      if (ipfsGetResult[0].content instanceof Buffer) {
        ms.write(ipfsGetResult[0].content)
      } else {
        ipfsGetResult[0].content.pipe(ms)
      }
    } else {
      const decryptedFileKey = await pgpCrypto.decrypt(file.fileKey.encryptedValue, downloadAccount)
      const fileDescryptor = AesCrypto(decryptedFileKey)
      const ipfsGetResult = (await ipfsStore.get(`/ipfs/${file.ipfsHash}`))
      if (ipfsGetResult[0].content instanceof Buffer) {
        ms.write(fileDescryptor.decrypt(ipfsGetResult[0].content))
      } else {
        ipfsGetResult[0].content.pipe(fileDescryptor.decryptStream())
          .pipe(ms)
      }
    }

    return {
      content: ms
    }
  }

  const grantAccessPermission = async (fileId, grantToUserKey) => {
    const file = await fileController.getById(fileId, 'signing')

    if (!file) {
      throw new Error('File not found')
    }

    if (!file.fileKey) {
      throw new Error('File is public')
    }

    // decrypt and encrypt with new keyset
    const masterAccount = await getMasterAccount()
    const grantToAccount = await getOrCreateUser(grantToUserKey)
    const filekey = file.fileKey
    const decryptedFileKey = await pgpCrypto.decrypt(filekey.encryptedValue, file.fileKey.owner)
    const signingAccount = filekey.signedBy.concat([grantToAccount])
    const encryptedFileKey = await pgpCrypto.encrypt(decryptedFileKey, masterAccount, filekey.owner, ...signingAccount)

    // updating database
    filekey.encryptedValue = encryptedFileKey
    await filekey.save()
    await filekey.$add('signedBy', signingAccount)
    return null
  }

  const revokeAccessPermission = async (fileId, revokeFromUserKey) => {
    const file = await fileController.getById(fileId, 'signing')

    if (!file) {
      throw new Error('File not found')
    }

    if (!file.fileKey) {
      throw new Error('File is public')
    }

    // decrypt and encrypt with new keyset
    const masterAccount = await getMasterAccount()
    const filekey = file.fileKey
    const decryptedFileKey = await pgpCrypto.decrypt(filekey.encryptedValue, file.fileKey.owner)
    const signingAccount = filekey.signedBy.filter(account => account.userKey !== revokeFromUserKey)
    const encryptedFileKey = await pgpCrypto.encrypt(decryptedFileKey, masterAccount, filekey.owner, ...signingAccount)

    // updating database
    filekey.encryptedValue = encryptedFileKey
    await filekey.save()
    await filekey.$set('signedBy', signingAccount)
    return null
  }

  const getUploadedFiles = async (userKey) => {
    const account = await accountController.getByUserKey(userKey, 'uploaded')

    if (!account) {
      throw new Error('User not found')
    }

    return account.files.map(file => ({
      id: file.id,
      fullpath: file.fullPath
    }))
  }

  const getPermissionedFile = async (userKey) => {
    const account = await accountController.getByUserKey(userKey, 'permissioned')

    if (!account) {
      throw new Error('User not found')
    }

    return account.signedFileKey.map(filekey => ({
      id: filekey.file.id,
      fullpath: filekey.file.fullPath,
      owner: filekey.file.ownerId
    }))
  }

  return {
    getOrCreateUser,
    uploadFile,
    downloadFile,
    grantAccessPermission,
    revokeAccessPermission,
    getUploadedFiles,
    getPermissionedFile
  }
}

export interface IObjectInfo {
  content: any,

}

export interface ICloudManager {
  registerUser: any;
  getOrCreateUser: any;
  uploadFile: any;
  downloadFile: any;
  grantAccessPermission: any;
  revokeAccessPermission: any;
  getUploadedFile: any;
  getPermissionedFile: any
}
