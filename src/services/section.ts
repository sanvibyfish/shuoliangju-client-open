/** @format */

import Request from '../utils/request'
import {requestConfig} from '../config/requestConfig'

export const getSections = data => {
  return Request.get(requestConfig.getSections, data)
}
