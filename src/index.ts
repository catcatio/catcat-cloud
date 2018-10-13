import 'dotenv/config'

import { config } from './config'
import { Server } from './server'
const server = Server(config)

server.start()
  .catch(err => {
    console.error('main', err.message)
    console.error('err')
  })
