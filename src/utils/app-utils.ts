/** @format */

import Taro from '@tarojs/taro'
import Tips from './tips'
import {globalData} from '../utils/common'

export default class AppUtils {
  constructor() { }

  static uploadBadge() {
    console.log(globalData.unread_counts)
    if (globalData.unread_counts) {
      const count = globalData.unread_counts.likes_unread_count + globalData.unread_counts.comments_unread_count
      if (count > 0) {
        Taro.setTabBarBadge({
          index: 1,
          text: `${count}`,
          success: () => {
          }
        })
      } else {
        Taro.removeTabBarBadge({
          index: 1
        })
      }
    }
  }
}