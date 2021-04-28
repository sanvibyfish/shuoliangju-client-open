/** @format */

import Request from '../utils/request'
import {requestConfig} from '../config/requestConfig'

export const getPosts = data => {
  return Request.get(requestConfig.getPosts, data)
}

export const newPost = data => {
  return Request.post(requestConfig.newPost, data)
}

export const getPost = data => {
  return Request.get(requestConfig.getPost(data.id))
}

export const getDiscoverPosts = data => {
  return Request.get(requestConfig.getDiscoverPosts,data)
}

export const likePost = data => {
  return Request.post(requestConfig.likePost(data.id), {})
}

export const qrcodePost = data => {
  return Request.post(requestConfig.qrcodePost(data.id), {})
}


export const unlikePost = data => {
  return Request.post(requestConfig.unlikePost(data.id), {})
}

export const starPost = data => {
  return Request.post(requestConfig.starPost(data.id), {})
}

export const unstarPost = data => {
  return Request.post(requestConfig.unstarPost(data.id), {})
}


export const excellentPost = data => {
  return Request.post(requestConfig.excellentPost(data.id), {})
}

export const unexcellentPost = data => {
  return Request.post(requestConfig.unexcellentPost(data.id), {})
}

export const topPost = data => {
  return Request.post(requestConfig.topPost(data.id), {})
}

export const untopPost = data => {
  return Request.post(requestConfig.untopPost(data.id), {})
}


export const banPost = data => {
  return Request.post(requestConfig.banPost(data.id), {})
}

export const unbanPost = data => {
  return Request.post(requestConfig.unbanPost(data.id), {})
}

export const reportPost = data => {
  return Request.post(requestConfig.reportPost(data.id), {})
}



export const destroyPost = data => {
  return Request.delete(requestConfig.destroyPost(data.id))
}