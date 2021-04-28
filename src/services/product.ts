/** @format */

import Request from '../utils/request'
import {requestConfig} from '../config/requestConfig'

export const getProducts = data => {
  return Request.get(requestConfig.getProducts, data)
}

export const createProduct = data => {
  return Request.post(requestConfig.createProduct, data)
}


export const getProduct = data => {
  return Request.get(requestConfig.getProduct(data.id), data)
}


export const deleteProduct = data => {
  return Request.delete(requestConfig.deleteProduct(data.id), data)
}