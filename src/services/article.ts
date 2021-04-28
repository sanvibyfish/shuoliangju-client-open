/** @format */

import Request from '../utils/request'
import {requestConfig} from '../config/requestConfig'

export const getArticles = data => {
  return Request.get(requestConfig.getArticles, data)
}

export const getArticle = data => {
  return Request.get(requestConfig.getArticle(data.id))
}

export const addArticle = data => {
  return Request.post(requestConfig.addArticle,data)
}

export const likeArticle = data => {
  return Request.post(requestConfig.likeArticle(data.id),{})
}

export const destroyArticle = data => {
  return Request.delete(requestConfig.destroyArticle(data.id))
}


export const unlikeArticle = data => {
  return Request.post(requestConfig.unlikeArticle(data.id),{})
}