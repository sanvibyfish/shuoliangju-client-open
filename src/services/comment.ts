/** @format */

import Request from '../utils/request'
import {requestConfig} from '../config/requestConfig'

export const getComments = data => {
  return Request.get(requestConfig.getComments, data)
}

export const createComment = data => {
  return Request.post(requestConfig.createComment, data)
}

export const likeComment = data => {
  return Request.post(requestConfig.likeComment(data.id), data)
}

export const unlikeComment = data => {
  return Request.post(requestConfig.unlikeComment(data.id), data)
}

export const deleteComment = data => {
  return Request.delete(requestConfig.deleteComment(data.id), data)
}
