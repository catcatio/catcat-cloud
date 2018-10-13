import { Router} from 'express'

import { ICloudManager } from '../cloudManager'
import { IConfig } from '../config'

import { handler as downloadFileHandler} from './downloadFileHandler'
import { handler as grantPermissionHandler} from './grantPermissionHandler'
import { handler as listPermissioned} from './listPermissioned'
import { handler as listUploadedHandler} from './listUploadedHandler'
import { handler as revokePermission} from './revokePermission'
import { handler as uploadFileHandler} from './uploadFileHandler'

export default async (cloudManager: ICloudManager, config: IConfig) => {
  const router = Router()
  router.use(uploadFileHandler(cloudManager))
  router.use(downloadFileHandler(cloudManager))
  router.use(grantPermissionHandler(cloudManager))
  router.use(revokePermission(cloudManager))
  router.use(listPermissioned(cloudManager))
  router.use(listUploadedHandler(cloudManager))

  router.use('/', (req, res) => res.send('OK'))
  return router
}
