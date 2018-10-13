import * as ipfsAPI from 'ipfs-api'
import { IIpfsConfig } from './config'

export const IpfsStore = (ipfsConfig: IIpfsConfig) => {
  const add = (data) => {
    const ipfs = ipfsAPI(ipfsConfig)
    return ipfs.files.add(data)
  }

  const get = (ipfsPath) => {
    const ipfs = ipfsAPI(ipfsConfig)
    return ipfs.files.get(ipfsPath)
  }

  return {
    get,
    add
  }
}

export interface IIpfsStore {
  add: any;
  get: any;
}
