import * as ipfsAPI from 'ipfs-api'

export const IpfsStore = ({ host = 'localhost', port = '5001', protocol = 'http' } = {}) => {
  const add = (data) => {
    const ipfs = ipfsAPI({ host, port, protocol })
    return ipfs.files.add(data)
  }

  const get = (ipfsPath) => {
    const ipfs = ipfsAPI({ host, port, protocol })
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

export interface IIpfsConfig {
  host: string;
  port: string;
  protocol: string;
}
