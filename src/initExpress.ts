import * as bodyParser from 'body-parser'
import * as cors from 'cors'
import * as express from 'express'
import * as fileUpload from 'express-fileupload'
import * as requestProxy from 'express-request-proxy'
import * as path from 'path'

import { IConfig } from './config'

export default async (config: IConfig) => {
  const app = express()

  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())
  app.use(cors())
  app.use(fileUpload())

  app.use(express.static(path.join(process.cwd(), 'public')))

  app.use('/pga', requestProxy({
    url: 'http://pgadmin:80'
  }))

  app.listen(config.port, (err) => {
    if (err) {
      throw err
    }

    console.log(`Listening to ${config.port}`)
  })

  return app
}
