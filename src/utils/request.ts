/** @format */

import Taro from '@tarojs/taro'
import { BASE_URL } from '../config'
import Tips from './tips'
import { Router } from '../config/router'
import { cleanUserStorageInfo, globalData } from './common';
import Storage from './storage';


export default class Request {
  static async baseOptions(params: any, method = 'GET') {
    let { url, data } = params
    let contentType = 'application/json'
    contentType = params.contentType || contentType
    const option = {
      url: BASE_URL + url,
      data: data,
      method: method,
      header: {
        'content-type': contentType,
        Authorization: Storage.get(Storage.TOKEN),
      },
      complete: () => {
        Taro.stopPullDownRefresh()
        Tips.loaded()
      }
    } as Taro.request.Option<any>
    if(!Tips.isLoading){
      Tips.loading()
    }
    const res = await Taro.request(option)
    console.log(
      `${new Date().toLocaleString()}【 M=${option.url} 】[opts:${JSON.stringify(option)}]【接口响应：】`,
      res.data,
    )
    return await this.handleResponse(res)
  }

  static async handleResponse(res: any) {
    if (res.statusCode == 200) {
      if (res.data.code == 200) {
        if (res.data.message) {
          await Tips.success(res.data.message)
          return res.data.data
        } else {
          return res.data.data
        }
      } else {
        if (res.data.code == 10001) {
          Router.navigateTo(Router.LOGIN, undefined, () => {
            Tips.failure(res.data.message)
          })
        } else if (res.data.code == 10003) {
          cleanUserStorageInfo()
        } else if (res.data.code == 401) {
          if (!globalData.token) {
            cleanUserStorageInfo()
            Router.navigateTo(Router.LOGIN, undefined, async () => {
              await Tips.failure(res.data.message)
            })
          } else {
            await Tips.failure(res.data.message)
          }
        } else if (res.data.code == 10005) {
          cleanUserStorageInfo()
          Router.navigateTo(Router.LOGIN, undefined, async () => {
            await Tips.failure(res.data.message)
          })
        } else {
          await Tips.failure(res.data.message)
        }
      }
    } else {
      Tips.failure(res.data.message)
    }
  }

  static get(url: string, data = '') {
    let option = { url, data }
    return this.baseOptions(option)
  }

  static post(url: string, data: any, contentType?: string) {
    let params = { url, data, contentType }
    return this.baseOptions(params, 'POST')
  }

  static put(url: string, data = '') {
    let option = { url, data }
    return this.baseOptions(option, 'PUT')
  }

  static async upload(url: string, filePath: string, data?: any) {
    const res = await Taro.uploadFile({
      url: BASE_URL + url,
      filePath: filePath,
      name: 'file', //必须填file
      formData: data,
      header: {
        'content-type': 'application/json',
        Authorization: Taro.getStorageSync('token'),
      },
    })
    console.log(
      `${new Date().toLocaleString()}【 M=${BASE_URL + url} 】[opts:${JSON.stringify(data)}]【接口响应：】`,
      res.data,
    )
    res.data = JSON.parse(res.data)
    return await this.handleResponse(res)
  }

  static delete(url: string, data = '') {
    let option = { url, data }
    return this.baseOptions(option, 'DELETE')
  }
}
