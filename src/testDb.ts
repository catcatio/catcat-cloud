import { Sequelize } from 'sequelize-typescript'
import { Account, File, FileKey, FileKeyAccount } from './models'

export const start = async () => {
  console.log('db started')
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

  try {
    const sequelize = new Sequelize(option)

    sequelize
      .sync({ force: true })
      .then(() => Promise.all([
        Account.create<Account>({ userKey: 'userKey1', publicKey: 'public1', privateKey: 'private1' }),
        Account.create<Account>({ userKey: 'userKey2', publicKey: 'public1', privateKey: 'private1' }),
        Account.create<Account>({ userKey: 'userKey3', publicKey: 'public1', privateKey: 'private1' })
      ]))
      .then(accounts => Promise.all(accounts.map(account => account.save())))
      .then(console.log)
      .catch(err => console.error(err.message))
  } catch (error) {
    console.log(error.message)
  }
}

// start()
