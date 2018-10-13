import * as fs from 'fs'
import * as path from 'path'

import { accountStore } from './accountStore'
import AESCrypto from './AESCrypto'
import { md5 } from './cryptoHelper'
import { IpfsStore } from './ipfsStore'
import { pgpCrypto } from './PgpCrypto'

const masterAccountName = 'SDKHAAERX2W2XXEWRIV6DHAWGWCDY7IEAP4LVE765NQE7F44E6JPKC4K'
const fileInfo = {
  name: 'movie.mp4',
  isPrivate: true,
  path: '/',
  owner: 'SD6TQ6HAJTS5ZNVTKIEHU62BL6MDAP7CAPYRJY2WZ5RSH35GHWI63UMH',
}

export const start = async () => {
  const ipfsStore = IpfsStore()
  const sourceFile = path.join(process.cwd(), 'staging', fileInfo.name)
  const desFile = path.join(process.cwd(), 'staging', `out.${fileInfo.name}`)
  const masterAccount = await accountStore.getOrCreate(md5(masterAccountName))
  const ownerAccount = await accountStore.getOrCreate(md5(fileInfo.owner))

  // const fileKey = await pgpCrypto.genFileKey()
  // console.log(fileKey)
  // const aesCrypto = AESCrypto(fileKey)
  // const fileStream = fs.createReadStream(sourceFile)
  //   .pipe(aesCrypto.encryptStream())

  // const ipfsResult = await ipfsStore.add(fileStream)
  // console.log(ipfsResult)

  const fileKey = 'qr+6n+leOw/p9EYvNo5RXru9QjAVwaW/ZztMeJDi4QA='
  const ipfsResult = [
    {
      path: 'QmQWmjaYBzKu3mfs86pLSES8c24zvWSBZ9fnXSp3eTqzqw',
      hash: 'QmQWmjaYBzKu3mfs86pLSES8c24zvWSBZ9fnXSp3eTqzqw',
      size: 17844139
    }
  ]
  const encryptedFileKey = await pgpCrypto.encrypt(fileKey, masterAccount, ownerAccount)

  // Get file and decrypt
  const decryptedFileKey = await pgpCrypto.decrypt(encryptedFileKey, masterAccount)
  const aesCrypto2 = AESCrypto(decryptedFileKey)
  const outFileStream = fs.createWriteStream(desFile)
  const ipfsGetResult = (await ipfsStore.get(`/ipfs/${ipfsResult[0].path}`))
  if (ipfsGetResult[0].content instanceof Buffer) {
    outFileStream.write(aesCrypto2.decrypt(ipfsGetResult[0].content))
  } else {
    ipfsGetResult[0].content.pipe(aesCrypto2.decryptStream())
      .pipe(outFileStream)
  }

  return {
    encryptedFileKey,
    ipfs: ipfsResult,
    // ownerAccount,
    // masterAccount,
    fileInfo,
    ipfsGetResult,
  }
}

// start()
//   .then(console.log)
//   .catch(console.error)

// [
//   {
//     path: 'QmWReYEf1PHSCC2LPXroRVD2T8rFDELMPqu57g1b4iDeGi',
//     hash: 'QmWReYEf1PHSCC2LPXroRVD2T8rFDELMPqu57g1b4iDeGi',
//     size: 17844139
//   }
// ]

/*
TODO: Producer submit a file
- [X] upload file through staging
- [X] gen FileKey
- [X] encrypt file and sign with user key
- [X] upload encrypted to ipfs https://github.com/ipfs/js-ipfs-api
- [X] producer able to download decrypted file
*/
