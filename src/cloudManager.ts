import { Readable } from 'stream'

import { default as AesCrypto } from './AESCrypto'
import { IIpfsStore } from './ipfsStore'
import { IPgpCrypto } from './PgpCrypto'

import accountController from './controllers/account'
import fileController from './controllers/file'
import fileKeyController from './controllers/filekey'

import { Account, FileKey } from './models'
import { bufferToStream } from './utils/buffer'

export const CloudManager = (
  pgpCrypto: IPgpCrypto,
  masterAccountUserKey: string,
  ipfsStore: IIpfsStore): ICloudManager => {

  let internalMasterAccount: Account
  const getMasterAccount = async () => internalMasterAccount ||
    (internalMasterAccount = await getOrCreateUser(masterAccountUserKey))

  const getOrCreateUser = async (userKey: string): Promise<Account> => {
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
    filename: string,
    mimetype: string,
    isPublic: boolean,
    ownerUserKey: string)  => {

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
      filename,
      mimetype,
      ownerAccount.id,
      storedFileKey ? storedFileKey.id : undefined)

    return {
      hash: ipfsResult[0].hash,
      path: ipfsResult[0].path,
      size: ipfsResult[0].size,
      fileId: storedFile.id
    }
  }

  const downloadFile = async (fileId: string, downloaderUserKey: string): Promise<{content: Readable, filename: string, mimetype: string}> => {
    const downloadAccount = await getOrCreateUser(downloaderUserKey)
    let content: Readable

    const file = await fileController.getById(fileId, 'full')
    if (!file) {
      throw new Error('File not found')
    }

    if (!file.fileKeyId) {
      const ipfsGetResult = (await ipfsStore.get(`/ipfs/${file.ipfsHash}`))
      if (ipfsGetResult[0].content instanceof Buffer) {
        content = bufferToStream(ipfsGetResult[0].content)
      } else {
        content = ipfsGetResult[0].content.pipe
      }
    } else {
      const decryptedFileKey = await pgpCrypto.decrypt(file.fileKey.encryptedValue, downloadAccount)
      const fileDescryptor = AesCrypto(decryptedFileKey)
      const ipfsGetResult = (await ipfsStore.get(`/ipfs/${file.ipfsHash}`))
      if (ipfsGetResult[0].content instanceof Buffer) {
        content = bufferToStream(fileDescryptor.decrypt(ipfsGetResult[0].content))
      } else {
        content = ipfsGetResult[0].content.pipe(fileDescryptor.decryptStream())
      }
    }

    return {
      content,
      filename: file.filename,
      mimetype: file.mimetype
    }
  }

  const grantAccessPermission = async (fileId: string, requester: string, grantToUserKey: string): Promise<boolean> => {
    const file = await fileController.getById(fileId, 'signing')

    if (!file) {
      throw new Error('File not found')
    }

    if (file.owner.userKey !== requester) {
      throw new Error('Unauthorized')
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
    return true
  }

  const revokeAccessPermission = async (fileId: string, requester: string, revokeFromUserKey: string) => {
    const file = await fileController.getById(fileId, 'signing')

    if (!file) {
      throw new Error('File not found')
    }

    if (file.owner.userKey !== requester) {
      throw new Error('Unauthorized')
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
    return true
  }

  const getUploadedFiles = async (userKey: string) => {
    const account = await accountController.getByUserKey(userKey, 'uploaded')

    if (!account) {
      throw new Error('User not found')
    }

    return account.files.map(file => ({
      id: file.id
    }))
  }

  const getPermissionedFile = async (userKey: string) => {
    const account = await accountController.getByUserKey(userKey, 'permissioned')

    if (!account) {
      throw new Error('User not found')
    }

    return account.signedFileKey.map(filekey => ({
      id: filekey.file.id
    }))
  }

  return {
    uploadFile,
    downloadFile,
    grantAccessPermission,
    revokeAccessPermission,
    getUploadedFiles,
    getPermissionedFile
  }
}

export interface ICloudManager {
  uploadFile(content: NodeJS.ReadableStream, filename: string, mimetype: string, isPublic: boolean, ownerUserKey: string): Promise<any>;
  downloadFile(fileId: string, downloaderUserKey: string): Promise<{content: Readable, filename: string, mimetype: string}>;
  grantAccessPermission(fileId: string, requester: string, grantToUserKey: string): Promise<boolean>;
  revokeAccessPermission(fileId: string, requester: string, revokeFromUserKey: string): Promise<any>;
  getUploadedFiles(userKey: string): Promise<any>;
  getPermissionedFile(userKey: string): Promise<any>;
}
