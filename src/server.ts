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
    const currentSchemaVersion = await cloudManager.getCurrentSchemaVersion()
    const liveSchemaVersion = await cloudManager.getLiveSchemaVersion()
    console.log(`schema live: ${liveSchemaVersion}, current: ${currentSchemaVersion}`)
    if (currentSchemaVersion !== liveSchemaVersion) {
      console.log(`updating schema to ${currentSchemaVersion}`)
      await sequelize.sync({force: true})
      const updateResult = await cloudManager.updateSchemaVersion(currentSchemaVersion)
      console.log(`schema updated to: ${updateResult ? updateResult.value : '???'}`)
    }

  }

  const stop = async () => {
    //
  }

  return {start, stop}
}
