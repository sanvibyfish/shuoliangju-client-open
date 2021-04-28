
import Taro, { Component, Config, useReachBottom } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import Api from '../../utils/request'
import './follower-list.scss'
import { BaseProps } from '../../utils/base.interface'
import Model from '../../utils/model'
import { getUsers } from '../../models/schema'
import { globalData } from '../../utils/common'
import { Router } from '../../config/router'
/**
 * follower-list.state 参数类型
 *
 * @export
 * @interface FollowerListState
 */
export interface FollowerListState {
  page: number
  userId: string | null
}

/**
 * followerList.props 参数类型
 *
 * @export
 * @interface FollowerListProps
 */
export interface FollowerListProps extends BaseProps {
  isLast: boolean,
  users: Array<Model.User>
  entities: any
}

@connect(({ followerList, entities, loading }) => ({
  ...followerList,
  entities: entities,
  loading: loading.models.followerList
}))

class FollowerList extends Component<FollowerListProps, FollowerListState> {
  config: Config = {
    navigationBarTitleText: '粉丝'
  }
  constructor(props: FollowerListProps) {
    super(props)
    this.state = {
      page: 1,
      userId: null
    }
  }
  componentWillMount() {
    let params = Router.getParams(this.$router.params)
    this.setState({
      userId: params.userId
    }, () => {
      this.getUsers()
    })
  }

  onPullDownRefresh() {
    this.setState(
      {
        page: 1,
      },
      () => {
        this.getUsers()
      },
    )
  }

  onFollowUser(item) {
    this.props.dispatch({
      type: 'followerList/followUser',
      payload: {
        id: item.id
      },
    })
  }

  onUnfollowUser(item) {
    this.props.dispatch({
      type: 'followerList/unfollowUser',
      payload: {
        id: item.id,
      },
    })
  }

  async getUsers() {
    await this.props.dispatch({
      type: 'followerList/getUsers',
      payload: {
        page: this.state.page,
        id: this.state.userId
      },
    })
  }

  onNavgateUserProfile(user) {
    Router.navigateTo(Router.USER_PROFILE, {
      userId: user.id,
      title: user.nick_name
    })
  }

  render() {
    const { isLast, loading, users, entities } = this.props
    const { userId } = this.state
    useReachBottom(() => {
      if (!isLast) {
        this.setState(
          {
            page: this.state.page + 1,
          },
          () => {
            this.getUsers()
          },
        )
      }
    })
    const isNotEmpty = (users && users.length > 0)

    return (
      <View className={`${isNotEmpty ? "container" : "empty-container"}`}>
        {
          isNotEmpty ? (
            <View className="follower-list">
              {
                getUsers(users, entities).map((item) => {
                  return (
                    <View className="follower-list-item">
                      <Image className="follower-list-item-avatar" src={item.avatar_url} onClick={this.onNavgateUserProfile.bind(this, item)}></Image>
                      <View className="follower-list-item-name">{item.nick_name}</View>
                      {
                        (globalData.userInfo.id == userId) && (
                          <View className="follower-list-item-btn" onClick={item.following ? this.onUnfollowUser.bind(this, item) : this.onFollowUser.bind(this, item)} >
                            {item.following ? "取消关注" : "关注"}
                          </View>
                        )
                      }

                    </View>
                  )
                })
              }

            </View>
          ) : (
              <View className="empty-bg">
                <Image src="https://shuoliangju-cn.oss-cn-qingdao.aliyuncs.com/production/config/undraw_followers_4i0p.png" mode="aspectFit"></Image>
                <View className="empty-bg-tips">还没有任何粉丝~</View>
              </View>
            )
        }



      </View>
    )
  }
}
export default FollowerList
