/** @format */

import Request from '../utils/request'
import {requestConfig} from '../config/requestConfig'

export const upload = (filePath: string, data?: any) => {
  return Request.upload(requestConfig.uploadFile, filePath, data)
}
