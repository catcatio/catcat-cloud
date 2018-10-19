import { Version } from '../models/Version'

const getSchemaVersion = async () => {
  return await Version.findById('schema')
}

const saveSchemaVersion = async (schemaVersion) => {
  const version = await getSchemaVersion()
  return version != null
    ? version.update({ value: schemaVersion })
    : Version.create<Version>({
      name: 'schema',
      value: schemaVersion
    })
}

export default {
  getSchemaVersion,
  saveSchemaVersion
}
