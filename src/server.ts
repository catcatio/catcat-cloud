import { IConfig } from './config'
import initCloudManager from './initCloudManager'
import initExpress from './initExpress'
import initSequelize from './initSequelize'
import Router from './routers'

export const Server = (config: IConfig) => {
  const start = async () => {
    console.log('starting server')
    const sequelize = await initSequelize(config)
    const cloudManager = await initCloudManager(config)
    const router = await Router(cloudManager, config)
    const app = await initExpress(config)
    app.use(router)

    // TODO: Explicit commmand for updating schema
    await sequelize.sync({force: true})
  }

  const stop = async () => {
    //
  }

  return {start, stop}
}
