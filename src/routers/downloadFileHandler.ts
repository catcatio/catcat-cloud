import { Router } from 'express'

import { ICloudManager } from '../cloudManager'

export const handler = (cloudManager: ICloudManager): Router => {
  const path = '/:key/download/:fileid'

  return Router().use(path, async (req, res) => {
    const { key, fileid } = req.params
    return cloudManager.downloadFile(fileid, key)
      .then(response => response.content.pipe(res))
      .catch(err => res.status(400).send(err.message))
  })
}
