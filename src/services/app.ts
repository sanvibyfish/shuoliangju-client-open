/** @format */

import Request from '../utils/request'
import {requestConfig} from '../config/requestConfig'

export const getApps = data => {
  return Request.get(requestConfig.getApps, data)
}

export const getApp = data => {
  return Request.get(requestConfig.getApp(data.id))
}


export const qrcodeApp = data => {
  return Request.post(requestConfig.qrcodeApp(data.id), data)
}

export const getConfig = data => {
  return Request.get(requestConfig.getConfig)
}

export const joinApp = data => {
  return Request.post(requestConfig.joinApp(data.id), data)
}


export const createApp = data => {
  return Request.post(requestConfig.createApp, data)
}

export const updateApp = data => {
  return Request.put(requestConfig.updateApp(data.id), data)
}

export const exitApp = data => {
  return Request.post(requestConfig.exitApp(data.id), data)
}

export const getAppMembers = data => {
  return Request.get(requestConfig.getAppMembers(data.id), data)
}
