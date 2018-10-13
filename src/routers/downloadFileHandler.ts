import { Router } from 'express'

import { ICloudManager } from '../cloudManager'

export const handler = (cloudManager: ICloudManager): Router => {
  const path = '/:key/download/:fileid'

  return Router().use(path, async (req, res) => {
    const { key, fileid } = req.params
    return cloudManager.downloadFile(fileid, key)
      .then(({content, filename, mimetype}) => {
        res.setHeader('Content-Disposition', 'attachment; filename=' + filename)
        res.setHeader('Content-Type', mimetype)
        content.pipe(res)
      })
      .catch(err => res.status(400).send(err.message))
  })
}
