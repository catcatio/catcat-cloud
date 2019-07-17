import * as ipfsClient from 'ipfs-http-client'
import { IIpfsConfig } from './config'

export const IpfsStore = (ipfsConfig: IIpfsConfig) => {
  const add = (data) => {
    const ipfs = ipfsClient(ipfsConfig)
    return ipfs.add(data)
  }

  const get = (ipfsPath) => {
    const ipfs = ipfsClient(ipfsConfig)
    return ipfs.get(ipfsPath)
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
