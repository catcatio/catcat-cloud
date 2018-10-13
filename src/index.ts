import * as testCloudManager from './testCloudManager'
import * as testDb from './testDb'
import * as testEncruption from './testEncryption'
import * as testIpfs from './testIpfs'

testEncruption.start()
testDb.start()

testIpfs.start()
  .then(console.log)
  .catch(console.error)

testCloudManager.start()
