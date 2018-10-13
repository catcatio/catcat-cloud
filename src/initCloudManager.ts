import { CloudManager } from './cloudManager';
import { IConfig } from './config'
import { IpfsStore } from './ipfsStore'
import { pgpCrypto } from './PgpCrypto'

export default async (config: IConfig) => {
  const { masterAccountUserKey } = config
  const ipfsStore = IpfsStore(config.ipfsConfig)
  const cloudManager = CloudManager(pgpCrypto, masterAccountUserKey, ipfsStore)
  return cloudManager
}
