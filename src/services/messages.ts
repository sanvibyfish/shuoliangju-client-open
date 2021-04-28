/** @format */

import Request from '../utils/request'
import {requestConfig} from '../config/requestConfig'

export const getLikesMessages = data => {
  return Request.get(requestConfig.getLikesMessages, data)
}

export const getCommentsMessages = data => {
  return Request.get(requestConfig.getCommentsMessages, data)
}

export const getUnreadCounts = data => {
  return Request.get(requestConfig.getUnreadCounts, data)
}

export const readMessages = data => {
  return Request.post(requestConfig.readMessages, data)
}
