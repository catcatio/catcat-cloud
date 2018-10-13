import { Router } from 'express'

import { ICloudManager } from '../cloudManager'

export const handler = (cloudManager: ICloudManager): Router => {
  const path = '/:key/permissioned'

  return Router().use(path, (req, res) => {
    const { key } = req.params
    cloudManager.getPermissionedFile(key)
      .then(response => res.send(response))
      .catch(err => res.status(400).send(err.message))
  })
}
