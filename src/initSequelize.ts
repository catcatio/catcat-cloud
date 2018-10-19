import { Sequelize } from 'sequelize-typescript'

import { IConfig } from './config'
import { Account, File, FileKey, FileKeyAccount, Version } from './models'

export default async (config: IConfig) => {
  console.log('initial Sequelize')
  const defaultConfig = {
    modelPaths: [FileKeyAccount, FileKey, File, Account, Version],
    operatorsAliases: Sequelize.Op as any,
    logging: false,
  }
  const option: any = Object.assign({}, defaultConfig, config.sequelizeConfig)

  const sequelize = new Sequelize(option)
  console.log('Sequelize initialized: ', await sequelize.databaseVersion())
  return sequelize
}
