import { IConfig } from './config'

export const CloudManager = (config: IConfig) => {
  const registerUser = async (name, email = null) => {
    return null
  }

  const getUser = async (name) => {
    return null
  }

  const uploadNewObject = async (objectInfo, owner) => {
    return null
  }

  const downloadObject = async (objectInfo, requester) => {
    return null
  }

  const grantAccessPermission = async (objectInfo, requester) => {
    return null
  }

  return {
    registerUser,
    uploadNewObject,
    downloadObject,
    grantAccessPermission
  }
}
