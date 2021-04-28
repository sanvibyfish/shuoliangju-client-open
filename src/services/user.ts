/** @format */

import Request from '../utils/request'
import {requestConfig} from '../config/requestConfig'

export const wechatLogin = data => {
  return Request.post(requestConfig.wechatLogin, data)
}

export const login = data => {
  return Request.post(requestConfig.login, data)
}

export const getUserInfo = data => {
  return Request.get(requestConfig.getUserInfo, data)
}

export const getUser = data => {
  return Request.get(requestConfig.getUser(data.id), data)
}

export const followUser = data => {
  return Request.post(requestConfig.followUser(data.id), data)
}
export const banUser = data => {
  return Request.post(requestConfig.banUser(data.id), data)
}
export const unbanUser = data => {
  return Request.post(requestConfig.unbanUser(data.id), data)
}

export const reportUser = data => {
  return Request.post(requestConfig.reportUser(data.id), data)
}


export const followerList = data => {
  return Request.get(requestConfig.followerList(data.id), data)
}

export const followingList = data => {
  return Request.get(requestConfig.followingList(data.id), data)
}

export const unfollowUser = data => {
  return Request.post(requestConfig.unfollowUser(data.id), data)
}

export const register = data => {
  return Request.post(requestConfig.register, data)
}

export const update = data => {
  return Request.put(requestConfig.updateUser(data.id), data)
}

export const userLikePosts = data => {
  return Request.get(requestConfig.userLikePosts(data.id), data)
}

export const userPosts = data => {
  return Request.get(requestConfig.userPosts(data.id), data)
}

export const userStarPosts = data => {
  return Request.get(requestConfig.userStarPosts(data.id), data)
}
