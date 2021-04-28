/** @format */

import Request from '../../utils/request'
import {api} from './api'

export const createGroup = data => {
  return Request.post(api.createGroup, data)
}

export const getGroups = data => {
  return Request.get(api.getGroups, data)
}

export const getGroup = data => {
  return Request.get(api.getGroup(data.id), data)
}

export const deleteGroup = data => {
  return Request.delete(api.deleteGroup(data.id), data)
}