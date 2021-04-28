/** @format */

import Taro from '@tarojs/taro'

export default class Storage {
  public static TOKEN = 'token'
  public static USER_INFO = 'user_info'
  public static OPENID = 'openid'
  public static CONFIG = 'config'

  static set(key: string, value: any) {
    Taro.setStorageSync(key, value)
  }

  static get(key: string): any {
    return Taro.getStorageSync(key)
  }

  static remove(key: string) {
    Taro.removeStorageSync(key)
  }

  static clear() {
    Taro.clearStorage()
  }
}
