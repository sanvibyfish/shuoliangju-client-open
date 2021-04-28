/** @format */

import Taro, { Component, Config, useReachBottom } from '@tarojs/taro'
import { View, Image, Text, Button } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import './user-profile.scss'
import { BaseProps } from '../../utils/base.interface'
import Model from 'src/utils/model'
import { user, post } from '../../models/schema'
import { denormalize } from 'normalizr'
import { Router } from '../../config/router'
import { globalData } from '../../utils/common'
import { J2Posts } from '../../components'
import Action from '../../utils/action'
import EntityUtils from '../../utils/entity_utils'
import { UserModel } from '../../models/data/model'
import wechatPng from '../../assets/images/wechat.png'
import Permissions from '../../utils/permissions'

/**
 * userProfile.state 参数类型
 *
 * @export
 * @interface UserProfileState
 */
export interface UserProfileState {
  userId: string | null
}

/**
 * userProfile.props 参数类型
 *
 * @export
 * @interface UserProfileProps
 */
export interface UserProfileProps extends BaseProps {
  entities: object
  postIds: Array<number>,
  isLast: boolean
  userId: number
}

@connect(({ userProfile, entities, loading }) => ({
  ...userProfile,
  entities: entities,
  loading: loading.models.userProfile,
}))
class UserProfile extends Component<UserProfileProps, UserProfileState> {
  config: Config = {
    navigationBarTitleText: '用户信息',
  }
  constructor(props: UserProfileProps) {
    super(props)
    this.state = {
      userId: null
    }
  }

  componentWillMount() {
    Taro.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#1F53E4',
    })
    let params = Router.getParams(this.$router.params)
    this.setState(
      {
        userId: params.userId,
      },
      async () => {
        let user = await this.getUser()
        Taro.setNavigationBarTitle({
          title: user.nick_name
        })
      },
    )
  }

  async getUser() {
    return await this.props.dispatch({
      type: 'userProfile/getUser',
      payload: {
        id: this.state.userId,
      },
    })
  }


  onFollowUser(e) {
    this.props.dispatch({
      type: 'userProfile/follow',
      payload: {
        id: this.state.userId,
      },
    })
  }


  onBanUser(e) {
    this.props.dispatch({
      type: 'userProfile/banUser',
      payload: {
        id: this.state.userId,
      },
    })
  }

  onUnbanUser(e) {
    this.props.dispatch({
      type: 'userProfile/unbanUser',
      payload: {
        id: this.state.userId,
      },
    })
  }

  onUnfollowUser(e) {
    this.props.dispatch({
      type: 'userProfile/unfollow',
      payload: {
        id: this.state.userId,
      },
    })
  }

  componentDidMount() { }

  onPullDownRefresh() {
    this.getUser()
  }

  onShareAppMessage() {
    const { userId } = this.state
    const { entities } = this.props
    let user = EntityUtils.getUser(entities, userId)

    return {
      title: `${globalData.userInfo.nick_name}给你分享了${user.nick_name}的个人主页`,
      path: `${Router.USER_PROFILE}?userId=${user.id}`
    }
  }

  onActionsButtonClick() {
    let items = Action.getUserActions(EntityUtils.getUser(this.props.entities, this.props.userId))
    Taro.showActionSheet({
      itemList: items.map((item) => item.value),
    })
      .then(res => {
        Action.sendUserAction(items[res.tapIndex], this.props.dispatch, this.props.userId)
        console.log(res.errMsg, res.tapIndex)
      })
      .catch(err => console.log(err.errMsg))
  }

  onNavgateFollowerList() {
    Router.navigateTo(Router.FOLLOWER_LIST, {
      userId: this.state.userId
    })
  }

  onNavgateFollowingList() {
    Router.navigateTo(Router.FOLLOWING_LIST, {
      userId: this.state.userId
    })
  }

  onNavgatePosts() {
    Router.navigateTo(Router.ME_POSTS, {
      userId: this.state.userId
    })
  }

  onNavgateGroupList() {
    Router.navigateTo(Router.GROUP_LIST, {
      userId: this.state.userId
    })
  }

  onNavgateProductList() {
    Router.navigateTo(Router.PRODUCT_LIST, {
      userId: this.state.userId
    })
  }

  onNavgateLikePosts() {
    Router.navigateTo(Router.LIKE_POSTS, {
      userId: this.state.userId
    })
  }

  onNavgateStarPosts() {
    Router.navigateTo(Router.STAR_POSTS, {
      userId: this.state.userId
    })
  }

  onNavgateAppInex() {
    Router.navigateTo(Router.INDEX, {
      userId: this.state.userId
    })
  }

  onNavgateGroup() {
    Permissions.subscribe(() => {
      Router.navigateTo(Router.HOME, {
        appId: 54
      })
    }, () => {
      Router.navigateTo(Router.HOME, {
        appId: 54
      })
    })
  }


  onNavgateUserInfo() {
    Router.navigateTo(Router.USER_INFO, {
      userId: this.state.userId
    })
  }

  onCopy(e){
    console.log(e)
    Taro.setClipboardData({
      data: 'data',
      success: function (res) {
        Taro.getClipboardData({
          success: function (res) {
            console.log(res.data) // data
          }
        })
      }
    })
  }

  render() {
    if (!this.props.userId) return <View />
    const { userId, entities } = this.props
    const userEntity = EntityUtils.getUser(entities, userId)

    return (
      <View className="container">
        <View className="user-avatar">
        <Image
              className="user-avatar-img"
              mode="aspectFill"
              src={userEntity ? userEntity.avatar_url : ''}></Image>
        </View>
      
        <View className="user-info-detail">
        <View className="user-profile-profile-items">
              {
                globalData.userInfo.id != userEntity.id &&
                <View
                  className="user-profile-profile-items-follow"
                  onClick={userEntity.following ? this.onUnfollowUser.bind(this) : this.onFollowUser.bind(this)}>
                  {userEntity.following ? '取消关注' : '关注'}
                </View>
              }
              <Button openType="share" className="user-profile-profile-items-share">
                <View  onClick={this.onActionsButtonClick.bind(this)}>
                  分享
              </View>
              </Button>
              <View className="user-profile-profile-items-actions" onClick={this.onActionsButtonClick.bind(this)}>
                更多
              </View>
            </View>
            <View className="user-info-detail-name">{userEntity.nick_name ? userEntity.nick_name : ""}
 
            
            </View>
            <View className="user-info-detail-identity" onClick={this.onCopy.bind(this,userEntity.identity)}> {userEntity.identity ? userEntity.identity : "TA还未设置任何身份"}</View>
            <View className="user-info-detail-summary" onClick={this.onCopy.bind(this,userEntity.summary)}>{userEntity.summary ? userEntity.summary : "TA还未设置任何自我介绍"}</View>
            <View className="user-info-detail-item" onClick={this.onCopy.bind(this,userEntity.cellphone)}><Text className="iconfont icon-mobile-phone user-info-detail-item-icon icon-img"></Text><Text className="user-info-detail-item-text">{userEntity.cellphone ? userEntity.cellphone : ""}</Text></View>
            <View className="user-info-detail-item" onClick={this.onCopy.bind(this,userEntity.wechat)}><Image src={wechatPng} className=" user-info-detail-item-icon icon-img" ></Image><Text className="user-info-detail-item-text">{userEntity.wechat ? userEntity.wechat : ""}</Text></View>
            <View className="user-info-detail-item" onClick={this.onCopy.bind(this,userEntity.labels)}><Text className="iconfont icon-jewelry user-info-detail-item-icon icon-img"></Text><Text className="user-info-detail-item-text">{userEntity.labels ? userEntity.labels : ""}</Text></View>
            <View className="user-info-detail-item" onClick={this.onCopy.bind(this,userEntity.email)}><Text className="iconfont icon-email user-info-detail-item-icon icon-img"></Text><Text className="user-info-detail-item-text">{userEntity.email ? userEntity.email : ""}</Text></View>
            <View className="user-info-detail-item" ><Text className="iconfont icon-map user-info-detail-item-icon icon-img"></Text><Text className="user-info-detail-item-text">{`${userEntity && userEntity.city ? userEntity.city : ''} ${
                  userEntity && userEntity.prefecture ? userEntity.prefecture : ''
                  }`}</Text></View>

          {
            (globalData.userInfo && globalData.userInfo.actions.includes("create_app")) &&
            (
              <View className="user-info-detail-item" onClick={this.onNavgateGroup.bind(this)}><Text className="iconfont icon-comments user-info-detail-item-icon icon-img"></Text><Text className="user-info-detail-item-text">给我留言</Text><Text className="iconfont icon-arrow-right user-info-detail-item-icon icon-img"></Text></View>
            )
          }


              </View>
       
      </View >
    )
  }
}
export default UserProfile
