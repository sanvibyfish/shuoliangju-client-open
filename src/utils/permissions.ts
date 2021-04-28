/** @format */

import Taro from '@tarojs/taro'
import Tips from './tips'
import {globalData} from './common'

export default class Permissions {
  constructor() { }

  static setOneRenderPremission(res, permission, resolve, reject) {
    if (!res.authSetting[permission]) {
      Tips.loading('相关权限获取中...')
      Taro.authorize({
        scope: permission,
        success(res) {
          Tips.loaded()
        },
        fail(err) {
          Tips.loaded()
          Taro.showModal({
            title: '提示',
            content: JSON.stringify(err),
            showCancel: false,
          })
          Taro.openSetting({
            success: function (dataAu) {
              if (dataAu.authSetting[permission] == true) {
                Taro.showToast({
                  title: 'success',
                  icon: 'success',
                  duration: 1000,
                })
                resolve()
              } else {
                Taro.showToast({
                  title: 'fail',
                  icon: 'none',
                  duration: 1000,
                })
                reject()
              }
            },
          })
        },
      })
    } else {
      resolve()
    }
  }

  static openUserInfo() {
    Taro.getSetting({
      success(res) {
        this.setOneRenderPremission(res, 'scope.userInfo')
      },
    })
  }

  static openUserLocation() {
    Taro.getSetting({
      success(res) {
        this.setOneRenderPremission(res, 'scope.userLocation')
      },
    })
  }


  static requestSubscribeMessage(tmplIds,successCallback,failCallback) {
    Taro.requestSubscribeMessage({
      tmplIds: tmplIds, // 需要授权的模版id，可在微信公众平台选取一个公共模版
      success: (res) => {
        let isOk = true
        for (const key of Object.keys(res)) {
          if (key != "errMsg" && res[key] != 'accept') {
            isOk = false
          }
        }
        if (res.errMsg == 'requestSubscribeMessage:ok' && isOk) {
          globalData.messageSubscribe = true
          successCallback()
        } else {
          failCallback()
        }
      },
      fail: (res) => {
        Tips.failure(`订阅失败，错误代码:${res.errCode},错误说明:${res.errMsg}`)
        failCallback()
      }
    });
  }

  static subscribe(successCallback, failCallback) {
    Taro.getSetting({
      withSubscriptions: true,
      success(res) {
        if (res.subscriptionsSetting && res.subscriptionsSetting.mainSwitch) {
          if(globalData.messageSubscribe) {
            successCallback()
          } else {
            if(!res.subscriptionsSetting.itemSettings) {
              Permissions.requestSubscribeMessage(['OhRg8zkKXuGIQRvprrKDY581hAaKhFbJDWf63bEsQSE', 'MQQk6_8CyvcfB0mLwnCBpaf1OTyXg4I_9tZH1aY8JFE', 'csvIUPkOmE8SsBJP-gCjOupXgGX8xryCtX8u11HhwxY'],successCallback,failCallback)
            } else {
              let tmplIds = []
              for (const key of Object.keys(res.subscriptionsSetting.itemSettings)) {
                if(res[key] != 'accept') {
                  tmplIds.push(key)
                }
              }
              if(tmplIds.length > 0 ) {
                Permissions.requestSubscribeMessage(tmplIds,successCallback,failCallback)
              }
            }
          }

        } else {
          Tips.failure("请到小程序设置打开订阅消息通知")
          failCallback()
        }
      },
    })
  }

  static openPhotosAlbum() {
    let self = this
    return new Promise(function (resolve, reject) {
      Taro.getSetting({
        success(res) {
          self.setOneRenderPremission(res, 'scope.writePhotosAlbum', resolve, reject)
        },
      })
    })
  }
}
