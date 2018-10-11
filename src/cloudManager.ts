import { IAccount, IAccountStore } from './accountStore'
import { default as AesCrypto } from './AESCrypto'
import { IConfig } from './config'
import { IIpfsStore } from './ipfsStore'
import { IPgpCrypto } from './PgpCrypto'

export const CloudManager = (
  accountStore: IAccountStore,
  pgpCrypto: IPgpCrypto,
  masterAccount: IAccount,
  ipfsStore: IIpfsStore,
  config: IConfig): ICloudManager => {
  const registerUser = async (id): Promise<IAccount> => {
    return accountStore.create(id)
  }

  const getUser = async (id): Promise<IAccount> => {
    return accountStore.get(id)
  }

  const uploadNewObject = async (content: NodeJS.ReadableStream, ownerAccount: IAccount) => {
    const fileKey = pgpCrypto.genFileKey()
    const fileEnscryptor = AesCrypto(fileKey)
    const encryptedFileKey = await pgpCrypto.encrypt(fileKey, masterAccount, ownerAccount)
    const encryptedFileStream = content.pipe(fileEnscryptor.encryptStream())
    const ipfsResult = await ipfsStore.add(encryptedFileStream)

    return {
      hash: ipfsResult[0].hash,
      size: ipfsResult[0].size,
      encryptedFileKey,
      originalFileKey: fileKey,
    }
  }

  const downloadObject = async (objectInfo, requester) => {
    const MemoryStream = require('memory-stream')
    const ms = new MemoryStream()
    const {
      hash, encryptedFileKey
    } = objectInfo
    const decryptedFileKey = await pgpCrypto.decrypt(encryptedFileKey, requester)
    const fileDescryptor = AesCrypto(decryptedFileKey)
    const ipfsGetResult = (await ipfsStore.get(`/ipfs/${hash}`))
    if (ipfsGetResult[0].content instanceof Buffer) {
      ms.write(fileDescryptor.decrypt(ipfsGetResult[0].content))
    } else {
      ipfsGetResult[0].content.pipe(fileDescryptor.decryptStream())
      .pipe(ms)
    }
    return {
      content: ms
    }
  }

  const grantAccessPermission = async (objectInfo, requester) => {
    const {
      originalFileKey
    } = objectInfo

    return null
  }

  return {
    registerUser,
    getUser,
    uploadNewObject,
    downloadObject,
    grantAccessPermission
  }
}

export interface IObjectInfo {
  content: any,

}

export interface ICloudManager {
  registerUser: any;
  getUser: any;
  uploadNewObject: any;
  downloadObject: any;
  grantAccessPermission: any;
}
