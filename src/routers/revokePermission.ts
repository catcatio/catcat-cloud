import { Router } from 'express'

import { ICloudManager } from '../cloudManager'

export const handler = (cloudManager: ICloudManager): Router => {
  const path = '/:key/revoke/:fileid/:fromkey'

  return Router().use(path, (req, res) => {
    const { key, fileid, fromkey } = req.params
    cloudManager.revokeAccessPermission(fileid, key, fromkey)
      .then(response => res.send(response))
      .catch(err => res.status(400).send(err.message))
  })
}
