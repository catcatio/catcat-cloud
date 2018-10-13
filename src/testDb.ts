import { Sequelize } from 'sequelize-typescript'
import { Account, File, FileKey, FileKeyAccount } from './models'

import accountController from './controllers/account'
import fileKeyController from './controllers/filekey'

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
    logging: true,
  }

  try {
    const sequelize = new Sequelize(option)

    sequelize
      .sync({ force: true })
      .then(async () => {
        const account1 = await accountController.create('userKey1', 'public1', 'private1')
        const account2 = await accountController.create('userKey2', 'public1', 'private1')
        const account3 = await accountController.create('userKey3', 'public1', 'private1')
        const account4 = await accountController.create('userKey4', 'public1', 'private1')
        const x = await accountController.getByUserKey('userKey1')
        if (!x) {
          throw new Error('ERROR')
        }
        const fileKey = await fileKeyController.create('encryptedValue', x.id)

        const result1 = await fileKey.$add('signedBy', account1)
        const result2 = await fileKey.$set('signedBy', [account2, account3, account4])
        const result3 = await fileKey.$remove('signedBy', account3)
        // const result3 = await fileKey.$set('owner', account2)
      })

    // sequelize
    //   .sync({ force: true })
    //   .then(() => Promise.all([
    //     accountController.create('userKey1', 'public1', 'private1'),
    //     accountController.create('userKey2', 'public1', 'private1'),
    //     accountController.create('userKey3', 'public1', 'private1'),
    //     accountController.create('userKey4', 'public1', 'private1'),
    //     accountController.create('userKey4', 'public1', 'private1')
    //   ]))
    //   .then(accounts => accounts.forEach(account => account && console.log(account)))
    //   .catch(err => console.error(err.message))
  } catch (error) {
    console.log(error)
  }
}

// start()
