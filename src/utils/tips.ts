/** @format */

import Taro from '@tarojs/taro'

/**
 * 整合封装微信的原生弹窗
 * 提示、加载、工具类
 */

export default class Tips {
  static isLoading = false

  /**
   * 提示信息
   */
  static toast(title: string, onHide?: () => void) {
    Taro.showToast({
      title: title,
      icon: 'none',
      mask: true,
      duration: 1500,
    })
    // 去除结束回调函数
    if (onHide) {
      setTimeout(() => {
        onHide()
      }, 500)
    }
  }

  /**
   * 弹出提示框
   */

  static success(title:string, duration = 1000): Promise<string>|void {
    Taro.showToast({
      title: title,
      icon: 'success',
      duration: duration,
      mask: true,
    })
    if (duration > 0) {
      return new Promise<string>(resolve => setTimeout(resolve, duration))
    }
  }

  /**
   * 弹出提示框
   */

  static failure(title:string, duration = 1500): Promise<string>|void {
    Taro.showToast({
      title: title,
      icon: 'none',
      duration: duration,
      mask: true,
    })
    if (duration > 0) {
      return new Promise(resolve => setTimeout(resolve, duration))
    }
  }

  /**
   * 弹出加载提示
   */
  static loading(title = '加载中', force = false) {
    console.log(this.isLoading)
    if (this.isLoading && !force) {
      return
    }
    this.isLoading = true
    if (Taro.showLoading) {
      Taro.showLoading({
        title: title,
        mask: true,
      })
    } else {
      Taro.showNavigationBarLoading()
    }
  }

  /**
   * 加载完毕
   */
  static loaded() {
    let duration = 0
    if (this.isLoading) {
      this.isLoading = false
      console.log(this.isLoading)
      if (Taro.hideLoading) {
        Taro.hideLoading()
      } else {
        Taro.hideNavigationBarLoading()
      }
      duration = 500
    }
    return new Promise(resolve => setTimeout(resolve, duration))
  }
}
