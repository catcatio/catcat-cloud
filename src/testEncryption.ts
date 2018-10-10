import { queryOrCreate } from './accountStore'
import AESCrypto from './AESCrypto'
import { md5 } from './cryptoHelper'
import * as pgpCrypto from './PgpCrypto'

export const start = async () => {
  const stellarSecretUser1 = 'SAJ5VAFNI6XSUMLY7XZW5SIEEHVINOU7PGPB63UUXWC7NC7HRWH57VLB'
  const stellarSecretUser2 = 'SC4NTEQUMAZU6C3BNVYTRLQDM5AZDJ7B4LGDNA3DK4EV2GCPZSEWBT3P'
  const stellarSecretUser3 = 'SBVOMHZBNV5NX2LS5WSKAHBBJDPJ67UVR5HF6SHRC3SGIAZIHEV5FYHC'
  const masterSecretUser = 'SCBVBQ2TYFCBK6DOYX3NU2QARTGGB5BIWMHB6KBECMNCBC3AWPJPHDQA'

  const masterkey = await queryOrCreate(md5(masterSecretUser), `${md5(masterSecretUser)}@example.com`)
  const user1 = await queryOrCreate(md5(stellarSecretUser1), `${md5(stellarSecretUser1)}@example.com`)
  const user2 = await queryOrCreate(md5(stellarSecretUser2), `${md5(stellarSecretUser2)}@example.com`)
  const user3 = await queryOrCreate(md5(stellarSecretUser3), `${md5(stellarSecretUser3)}@example.com`)

  const fileData = new Buffer('hello world!!', 'utf8')
  const fileKey = await pgpCrypto.genFileKey()

  const aesCrypto = AESCrypto(fileKey)

  console.log('fileKey', '\n', fileKey)
  console.log('original content', '\n', fileData.toString())
  const encryptedFile = aesCrypto.encrypt(fileData)
  console.log('encrypted content', '\n', encryptedFile.toString('hex'))

  const encryptedFileKey = await pgpCrypto.encrypt(fileKey, masterkey, user1, user2)
  console.log('decrypted fileKey with master', '\n',
    (await pgpCrypto.decrypt(encryptedFileKey, masterkey)).toString())
  console.log('decrypted fileKey with user 1', '\n',
    (await pgpCrypto.decrypt(encryptedFileKey, user1)).toString())
  console.log('decrypted fileKey with user 2', '\n',
    (await pgpCrypto.decrypt(encryptedFileKey, user2)).toString())
  console.log('decrypted fileKey with user 3', '\n',
    (await pgpCrypto.decrypt(encryptedFileKey, user3).catch((_) => 'FAILED')).toString())

  const decryptedFileKey = await pgpCrypto.decrypt(encryptedFileKey, user1)
  const aesCrypto2 = AESCrypto(decryptedFileKey)
  const decryptedContent = await aesCrypto2.decrypt(encryptedFile)
  console.log('decrypted content', '\n', decryptedContent.toString())
}
