/** @format */

import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Button } from '@tarojs/components'
import { globalData, logout } from '../../utils/common'

import { connect } from '@tarojs/redux'
// import Api from '../../utils/request'
// import Tips from '../../utils/tips'
import { MeProps, MeState } from './me.interface'
import './me.scss'
import { Router } from '../../config/router'
import { J2ListItem } from '../../components'
import Storage from '../../utils/storage'
import Tips from '../../utils/tips'
import AppUtils from '../../utils/app-utils'
import EventCenter from '../../utils/event-center'
import wechatPng from '../../assets/images/wechat.png'
import imagePng from '../../assets/images/image.png'
@connect(({ user, loading }) => ({
  ...user,
  loading: loading.models.user
}))
class Me extends Component<MeProps, MeState> {
  config: Config = {
    navigationBarTitleText: '卢灿伟Sanvi',
    enablePullDownRefresh: true,
  }
  constructor(props: MeProps) {
    super(props)
    this.state = {}
  }

  defaultProps = {
    hasLoging: false,
  }

  handleProfile() {
    if (this.props.hasLogin) {
      Router.navigateTo(Router.PROFILE)
    } else {
      Router.navigateTo(Router.LOGIN)
    }
  }

  register() {
    Router.navigateTo(Router.REGISTER)
  }

  onPullDownRefresh() {
    if (globalData.hasLogin) {
      this.props.dispatch({
        type: 'user/getUserInfo',
      })
    }
  }

  componentWillMount() {
    Taro.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#1F53E4',
    })
    Taro.eventCenter.on(EventCenter.FOLLOW_USER, () => {
      this.onPullDownRefresh()
    })
    Taro.eventCenter.on(EventCenter.UNFOLLOW_USER, () => {
      this.onPullDownRefresh()
    })
  }

  componentWillUnmount() {
    Taro.eventCenter.off(EventCenter.FOLLOW_USER)
    Taro.eventCenter.off(EventCenter.UNFOLLOW_USER)
  }

  componentDidShow() {
    AppUtils.uploadBadge()
  }

  componentDidHide() { }

  componentDidMount() {
    let that = this
    Taro.checkSession()
      .then(() => {
        this.props.dispatch({
          type: 'user/save',
          payload: {
            user: globalData.userInfo,
            hasLogin: globalData.hasLogin,
          },
        })
      })
      .catch((e) => {
        console.log("check session fail", e)
        logout(that.props.dispatch)
      })
    if (globalData.hasLogin) {
      this.props.dispatch({
        type: 'user/getUserInfo',
      })
    }
  }


  onNavgateMePosts() {
    Router.navigateTo(Router.ME_POSTS, {
      userId: globalData.userInfo.id
    })
  }

  onNavgateMeAppInex() {
    Router.navigateTo(Router.INDEX, {
      userId: globalData.userInfo.id
    })
  }


  onNavgateFollowerList() {
    Router.navigateTo(Router.FOLLOWER_LIST, {
      userId: globalData.userInfo.id
    })
  }

  onNavgateFollowingList() {
    Router.navigateTo(Router.FOLLOWING_LIST, {
      userId: globalData.userInfo.id
    })
  }

  onNavgateGroupList() {
    Router.navigateTo(Router.GROUP_LIST, {
      userId: globalData.userInfo.id
    })
  }

  onNavgateProductList() {
    Router.navigateTo(Router.PRODUCT_LIST, {
      userId: globalData.userInfo.id
    })
  }

  onNavgateLikePosts() {
    Router.navigateTo(Router.LIKE_POSTS, {
      userId: globalData.userInfo.id
    })
  }

  onNavgateStarPosts() {
    Router.navigateTo(Router.STAR_POSTS, {
      userId: globalData.userInfo.id
    })
  }

  onNavgateLogin() {
    Router.navigateTo(Router.LOGIN)
  }

  onShareAppMessage() {
    return {
      title: `${globalData.userInfo.nick_name}给你分享了他的个人主页`,
      path: `${Router.USER_PROFILE}?userId=${globalData.userInfo.id}`
    }
  }


  render() {
    const { user, loading } = this.props
    let notLogin = (globalData.userInfo == "" || globalData.userInfo == null)
    return (
      <View className={`container ${notLogin ? "login-container" : ""}`}>
        {
          notLogin ?
            (
              <View className="index-login">
                <Image src="https://shuoliangju-cn.oss-cn-qingdao.aliyuncs.com/production/config/undraw_mobile_login_ikmv.png" mode="aspectFit"></Image>
                <View className="index-login-tips">加入进来聊两句</View>
                <View className="btn login-btn" onClick={this.onNavgateLogin.bind(this)}>登录留言</View>
              </View>
            ) : (
              <View className="body">
                <View className="me">
                  <Image
                    className="me-info-avatar"
                    mode="scaleToFill"
                    src={this.props.user ? this.props.user.avatar_url : ''}></Image>
                  <View className="me-info">
                    <View className="me-info-name">
                      {this.props.user.nick_name}
                    </View>
                    <View className="me-profile">
                      <View className="me-profile-counts">
                        {user.identity ? user.identity : ""}
                      </View>
                    </View>
                  </View>
                  <View className="me-share-items">
                    <Button openType="share" className="me-share-item">
                      <Image src={wechatPng} className="me-share-item-icon"></Image>
                      <View className="me-share-item-text">微信分享</View>
                    </Button>
                    {/* <Button className="me-share-item" >
                      <Image src={imagePng} className="me-share-item-icon"></Image>
                      <View className="me-share-item-text">图片分享</View>
                    </Button> */}
                  </View>
                </View>
                <View className="feature-list">

                  <View className="feature-list-title">关于我</View>

                  <View className="feature-list-items">
                    <View className="feature-list-items-left following-color" onClick={this.onNavgateFollowingList.bind(this)}>
                      <View className="feature-list-items-title">我的关注</View>
                      <View className="feature-list-items-content">{user.following_count}人</View>
                    </View>

                    <View className="feature-list-items-right follower-color" onClick={this.onNavgateFollowerList.bind(this)}>
                      <View className="feature-list-items-title">我的粉丝</View>
                      <View className="feature-list-items-content">{user.followers_count}人</View>
                    </View>
                  </View>

                  <View className="feature-list-items">
                    <View className="feature-list-items-left post-color" onClick={this.onNavgateMePosts.bind(this)}>
                      <View className="feature-list-items-title">我的帖子</View>
                      <View className="feature-list-items-content">{user.post_count}</View>
                    </View>
                    <View className="feature-list-items-left like-color" onClick={this.onNavgateLikePosts.bind(this)}>
                      <View className="feature-list-items-title">我的点赞</View>
                      <View className="feature-list-items-content"> </View>
                    </View>
                  </View>

                  <View className="feature-list-items">
                    <View className="feature-list-items-left profile-color" onClick={this.handleProfile.bind(this)}>
                      <View className="feature-list-items-title">我的信息</View>
                      <View className="feature-list-items-content"></View>
                    </View>

                    <View className="feature-list-items-right star-color" onClick={this.onNavgateStarPosts.bind(this)}>
                      <View className="feature-list-items-title">我的收藏</View>
                      <View className="feature-list-items-content"> </View>
                    </View>
                  </View>

                  <View className="feature-list-title">功能试验区</View>


                  <View className="feature-list-items">
                    <View className="feature-list-items-right group-color" onClick={this.onNavgateGroupList.bind(this)}>
                      <View className="feature-list-items-title">我的群</View>
                      <View className="feature-list-items-content"></View>
                    </View>
                    <View className="feature-list-items-left app-color" onClick={this.onNavgateMeAppInex.bind(this)}>
                      <View className="feature-list-items-title">我的社区</View>
                      <View className="feature-list-items-content"></View>
                    </View>
                  </View>
                  <View className="feature-list-items">


                    <View className="feature-list-items-right product-color" onClick={this.onNavgateProductList.bind(this)}>
                      <View className="feature-list-items-title">我的产品图册</View>
                      <View className="feature-list-items-content"></View>
                    </View>
                  </View>
                </View>
              </View>
            )
        }

      </View>
    )
  }
}
export default Me
