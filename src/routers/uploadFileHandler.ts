import { Router } from 'express'

import { ICloudManager } from '../cloudManager'
import { bufferToStream } from '../utils/buffer'

export const handler = (cloudManager: ICloudManager): Router => {
  const path = '/:key/upload'

  return Router().post(path, (req, res) => {
    console.log('Upload file ')
    const { key } = req.params
    const files = (req as any).files
    const isPublic = req.query.isPublic === 'true'

    console.log(files.upload)

    if (!files || !files.upload) {
      return res.status(400).send('No files were uploaded.')
    }

    if (files.upload.truncated) {
      return res.status(400).send('File size exceeded')
    }

    return cloudManager.uploadFile(
      bufferToStream(files.upload.data),
      files.upload.name,
      files.upload.mimetype,
      isPublic,
      key)
      .then(response => res.send(response))
      .catch(err => res.status(400).send(err.message))
  })
}
