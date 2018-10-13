import { SequelizeConfig } from 'sequelize-typescript/lib/types/SequelizeConfig'

const defaultPort = '3000'
const sequelizeConfig: SequelizeConfig = {
  name: process.env.SEQUELIZE_DBNAME || 'unknown',
  dialect: process.env.SEQUELIZE_DIALECT || 'postgres',
  host: process.env.SEQUELIZE_HOST || 'localhost',
  username: process.env.SEQUELIZE_USERNAME || 'root',
  password: process.env.SEQUELIZE_PASSWORD || '',
}

const ipfsConfig: IIpfsConfig = {
  host: process.env.IPFS_HOST || 'localhost',
  port: process.env.IPFS_PORT || '5001',
  protocol: process.env.IPFS_PROTOCOL || 'http',
}

const masterAccountUserKey = process.env.MASTER_ACCOUNT_KEY || 'MASTER_ACCOUNTXX'
const port = parseInt(process.env.PORT || defaultPort, 10)

export const config: IConfig = {
  port,
  sequelizeConfig,
  masterAccountUserKey,
  ipfsConfig
}
export interface IConfig {
  port: number,
  sequelizeConfig: SequelizeConfig,
  masterAccountUserKey: string,
  ipfsConfig: IIpfsConfig
}

export interface IIpfsConfig {
  host: string,
  port: string,
  protocol: string
}
