
import Taro, { Component, Config, useReachBottom } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import Api from '../../utils/request'
import './following-list.scss'
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

@connect(({ followingList, entities, loading }) => ({
  ...followingList,
  entities: entities,
  loading: loading.models.followingList
}))

class FollowerList extends Component<FollowerListProps, FollowerListState> {
  config: Config = {
    navigationBarTitleText: '关注'
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



  async getUsers() {
    await this.props.dispatch({
      type: 'followingList/getUsers',
      payload: {
        page: this.state.page,
        id: this.state.userId
      },
    })
  }

  onUnfollowUser(item) {
    this.props.dispatch({
      type: 'followingList/unfollowUser',
      payload: {
        id: item.id,
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
            <View className="following-list">
              {
                (users && users.length != 0) && getUsers(users, entities).map((item) => {
                  return (
                    <View className="following-list-item" >
                      <Image className="following-list-item-avatar" src={item.avatar_url} onClick={this.onNavgateUserProfile.bind(this, item)}></Image>
                      <View className="following-list-item-name">{item.nick_name}</View>
                      {
                        (globalData.userInfo.id == userId) && (
                          <View className="following-list-item-btn" onClick={this.onUnfollowUser.bind(this, item)} >
                            取消关注
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
                <Image src="https://shuoliangju-cn.oss-cn-qingdao.aliyuncs.com/production/config/undraw_following_q0cr.png" mode="aspectFit"></Image>
                <View className="empty-bg-tips">还没有任何关注~</View>
              </View>
            )
        }
      </View>
    )
  }
}
export default FollowerList
