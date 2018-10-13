import { Sequelize } from 'sequelize-typescript'

import { Account, File, FileKey, FileKeyAccount } from './models'

export default async () => {
  const option: any = {
    name: 'catca-cloud',
    dialect: 'postgres',
    host: 'localhost',
    username: 'root',
    password: 'password',
    modelPaths: [FileKeyAccount, FileKey, File, Account],
    // modelPaths: [__dirname + '/models/!(index)*.ts'],
    operatorsAliases: Sequelize.Op as any,
    logging: false,
  }

  const sequelize = new Sequelize(option)
  console.log(await sequelize.databaseVersion())
  return sequelize
}
