import { Router } from 'express'

import { ICloudManager } from '../cloudManager'

export const handler = (cloudManager: ICloudManager): Router => {
  const path = '/:key/grant/:fileid/:tokey'

  return Router().use(path, (req, res) => {
    const { key, fileid, tokey } = req.params
    cloudManager.grantAccessPermission(fileid, key, tokey)
      .then(response => res.send(response))
      .catch(err => res.status(400).send(err.message))
  })
}
