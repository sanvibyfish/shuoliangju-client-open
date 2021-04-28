/** @format */

import Taro from '@tarojs/taro'
import queryString from 'query-string'
export class Router {
  public static INDEX = '/pages/index/index'
  public static HOME = '/pages/home/home'
  public static ME = '/pages/me/me'
  public static POST_DETAIL = '/pages/post-detail/post-detail'
  public static REGISTER = '/pages/register/register'
  public static LOGIN = '/pages/login/login'
  public static LOGIN_PASSWORD = '/pages/loginPassword/loginPassword'
  public static PROFILE = '/pages/profile/profile'
  public static NEW_POST = '/pages/new-post/new-post'
  public static SECTION_DETAIL = '/pages/section-detail/section-detail'
  public static CHOOSE_SECTIONS = '/pages/choose-sections/choose-sections'
  public static INPUT_FORM = '/pages/input-form/input-form'
  public static LIKE_MESSAGES = '/pages/like-messages/like-messages'
  public static COMMENT_MESSAGES = '/pages/comment-messages/comment-messages'
  public static USER_PROFILE = '/pages/user-profile/user-profile'
  public static LIKE_POSTS = '/pages/like-posts/like-posts'
  public static ME_POSTS = '/pages/me-posts/me-posts'
  public static STAR_POSTS = '/pages/star-posts/star-posts'
  public static FOLLOWER_LIST = "/pages/follower-list/follower-list"
  public static FOLLOWING_LIST = "/pages/following-list/following-list"
  public static ARTICLE = '/pages/article/article'
  public static ARTICLE_DETAIL = '/pages/article-detail/article-detail'
  public static CREATE_APP = '/pages/create-app/create-app'
  public static NEW_ARTICLE = '/pages/new-article/new-article'
  public static APP_DETAIL = '/pages/app-detail/app-detail'
  public static APP_MEMBERS = '/pages/app-members/app-members'
  public static MESSAGE_SUBSCRIBE = '/pages/message-subscribe/message-subscribe'

  public static PRODUCT_LIST = '/pages/product-list/product-list'
  public static CREATE_PRODUCT = '/pages/create-product/create-product'
  public static SETTING = '/pages/setting/setting'
  public static USER_INFO = '/pages/user-info/user-info'
  public static WEBVIEW_PAGE = '/pages/webview-page/webview-page'
  public static PRODUCT_DETAIL = '/pages/product-detail/product-detail'

  //分包在这里
  public static FEATURE_HOME ='/feature-pages/pages/feature-home/feature-home'
  public static GROUP_LIST = '/feature-pages/pages/group-list/group-list'
  public static CREATE_GROUP = '/feature-pages/pages/create-group/create-group'
  public static GROUP_DETAIL = '/feature-pages/pages/group-detail/group-detail'
  /**
   * function
   * @param {string} url 目标页面的路由
   * @param {Object} param 传递给目标页面的参数
   * @description  处理目标页面的参数，转成json字符串传递给param字段，在目标页面通过JSON.parse(options.param)接收
   */

  static navigateTo(url: string, params?: object, successCallback?: any) {
    if (params) {
      url += `?${this.serialize(params)}`
    }
    Taro.navigateTo({
      url: url,
      success: successCallback,
      fail(err) {
        console.log('navigateTo跳转出错', err)
      },
    })
  }

  static redirectTo(url: string, params?: object, successCallback?: any){
    if (params) {
      url += `?${this.serialize(params)}`
    }
    Taro.redirectTo({
      url: url,
      success: successCallback,
      fail(err) {
        console.log('navigateTo跳转出错', err)
      },
    })
  }

  static serialize( obj ) {
    return Object.keys(obj).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(obj[k])}`).join('&');
  }


  static canBack() {
    let pages = Taro.getCurrentPages()
    if(pages.length > 1) {
      return true
    } else {
      return false
    }
  }

  static back(option?: any, params?: any) {
    if(params && Object.keys(params).length > 0) {
      let pages = Taro.getCurrentPages()
      let prevPage = pages[pages.length - 2] // 上一个页面
      prevPage.$component.setState(
        {
          ...params,
        },
        () => {
          Taro.navigateBack(option)
        },
      )
    } else {
      Taro.navigateBack(option)
    }
  }

  static getParams(taroRuter: any): any {
    if(taroRuter.scene) {
      return queryString.parse(decodeURIComponent(taroRuter.scene))
    } else {
      return taroRuter
    }
    
  }
}
