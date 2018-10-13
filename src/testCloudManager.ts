import * as sts from 'string-to-stream'

import { CloudManager } from './cloudManager'
import { IConfig } from './config'
import initSequelize from './initSequelize'
import { IpfsStore } from './ipfsStore'
import { pgpCrypto } from './PgpCrypto'

export const start = async () => {
  console.log('go cloud manager')
  const sequelize = await initSequelize()
  // cleanup db
  // await sequelize.sync({force: true})

  const masterAccountUserKey = 'SDKHAAERX2W2XXEWRIV6DHAWGWCDY7IEAP4LVE765NQE7F44E6JPKC4K'
  const ipfsStore = IpfsStore()
  const config: IConfig = null as any
  const cloudManager = CloudManager(pgpCrypto, masterAccountUserKey, ipfsStore)

  const ownerUserKey = 'FILE_OWNER'
  // upload file, private
  const uploadedPrivateFile = await cloudManager.uploadFile(
    sts('This is an awesome private text file\0'),
    '/root/fileText',
     false,
     ownerUserKey)
  console.log(uploadedPrivateFile)

  // upload file, private
  const uploadedPublicFile = await cloudManager.uploadFile(
    sts('This is an awesome public text file\0'),
    '/root/fileText',
     true,
     ownerUserKey)
  console.log(uploadedPublicFile)

  const downloadOwnerPrivateResult = await cloudManager.downloadFile(uploadedPrivateFile.fileId, ownerUserKey)
    .catch(err => ({ content: err.message }))
  console.log(ownerUserKey, downloadOwnerPrivateResult.content.toString())

  const downloadOwnerPublicResult = await cloudManager.downloadFile(uploadedPublicFile.fileId, ownerUserKey)
    .catch(err => ({ content: err.message }))
  console.log(ownerUserKey, downloadOwnerPublicResult.content.toString())

  const privateFileId = uploadedPrivateFile.fileId
  const publicFileId = uploadedPublicFile.fileId

  const downloaderUserKey = 'FILE_DOWNLOADER'
  const downloaderUserKey2 = 'FILE_DOWNLOADER2'
  const downloaderUserKey3 = 'FILE_DOWNLOADER3'
  const downloaderUserKey4 = 'FILE_DOWNLOADER4'
  const downloadResult = await cloudManager.downloadFile(publicFileId, downloaderUserKey)
    .catch(err => ({ content: err.message }))
  console.log(downloaderUserKey, downloadResult.content.toString())

  await cloudManager.revokeAccessPermission(privateFileId, downloaderUserKey)
  const downloadResult1 = await cloudManager.downloadFile(privateFileId, downloaderUserKey)
    .catch(err => ({ content: err.message }))
  console.log(downloaderUserKey, downloadResult1.content.toString())

  await cloudManager.grantAccessPermission(privateFileId, downloaderUserKey)
  const downloadResult2 = await cloudManager.downloadFile(privateFileId, downloaderUserKey)
    .catch(err => ({ content: err.message }))
  console.log(downloaderUserKey, downloadResult2.content.toString())

  await cloudManager.grantAccessPermission(privateFileId, downloaderUserKey2)
  await cloudManager.grantAccessPermission(privateFileId, downloaderUserKey3)
  await cloudManager.grantAccessPermission(privateFileId, downloaderUserKey4)
  const downloadResult3 = await cloudManager.downloadFile(privateFileId, downloaderUserKey2)
    .catch(err => ({ content: err.message }))
  console.log(downloaderUserKey2, downloadResult3.content.toString())

  await cloudManager.revokeAccessPermission(privateFileId, downloaderUserKey2)
  const downloadResult4 = await cloudManager.downloadFile(privateFileId, downloaderUserKey2)
    .catch(err => ({ content: err.message }))
  console.log(downloaderUserKey2, downloadResult4.content.toString())
}
