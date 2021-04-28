/** @format */

import Storage from '../utils/storage'
import EventCenter from './event-center'
import Taro from '@tarojs/taro'

/**
 * 共用函数
 */

export const repeat = (str = '0', times) => new Array(times + 1).join(str)
// 时间前面 +0
export const pad = (num, maxLength = 2) => repeat('0', maxLength - num.toString().length) + num

// 全局的公共变量
export let globalData: any = {
  userInfo: null,
  openid: null,
  hasLogin: false,
  token: null,
  config: null,
  unread_counts: null,
  messageSubscribe: false
}

// 时间格式装换函数

export const formatTime = time => {
  ;`${pad(time.getHours())}:${pad(time.getMinutes())}:${pad(time.getSeconds())}.${pad(time.getMilliseconds(), 3)}`
}

export const cleanUserStorageInfo = () => {
  globalData.token = null
  globalData.userInfo = null
  globalData.openid = null
  globalData.hasLogin = false
  globalData.config = null
  Storage.remove(Storage.TOKEN)
  Storage.remove(Storage.USER_INFO)
  Storage.remove(Storage.OPENID)
  Storage.remove(Storage.CONFIG)
}

export const logout = dispatch => {
  cleanUserStorageInfo()
  dispatch({type: 'reset'})
  dispatch({
    type: 'user/logout',
    payload: {
      user: null,
      hasLogin: false,
    },
  })
  Taro.eventCenter.trigger(EventCenter.LOGOUT_SUCCESS)
}
