
import Taro, { Component, Config, useReachBottom } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import Api from '../../utils/request'
import './app-members.scss'
import { BaseProps } from '../../utils/base.interface'
import { Router } from '../../config/router'
import EntityUtils from '../../utils/entity_utils'
/**
 * app-members.state 参数类型
 *
 * @export
 * @interface App-membersState
 */
export interface AppMembersState {
  page: number
  appId: number | null
}

/**
 * appMembers.props 参数类型
 *
 * @export
 * @interface AppMembersProps
 */
export interface AppMembersProps extends BaseProps {
  memberIds: Array<number>,
  isLast: boolean
}

@connect(({ appMembers, entities, loading }) => ({
  ...appMembers,
  entities: entities,
  loading: loading.models.appMembers
}))

class AppMembers extends Component<AppMembersProps, AppMembersState> {
  config: Config = {
    navigationBarTitleText: '成员列表'
  }
  constructor(props: AppMembersProps) {
    super(props)
    this.state = {
      page: 1,
      appId: null
    }
  }

  componentWillMount() {
    let params = Router.getParams(this.$router.params)
    this.setState({
      appId: params.appId
    }, () => {
      this.getAppMembers()
    })
  }

  onPullDownRefresh() {
    this.setState(
      {
        page: 1,
      },
      () => {
        this.getAppMembers()
      },
    )
  }

  async getAppMembers() {
    await this.props.dispatch({
      type: 'appMembers/getAppMembers',
      payload: {
        page: this.state.page,
        id: this.state.appId
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
    const { memberIds, entities, isLast } = this.props
    const {appId} = this.state
    const members = EntityUtils.getUsers(entities, memberIds)
    const app = EntityUtils.getApp(entities,appId)
    useReachBottom(() => {
      if (!isLast) {
        this.setState(
          {
            page: this.state.page + 1,
          },
          () => {
            this.getAppMembers()
          },
        )
      }
    })

    return (
      <View className='container'>
        <View className="members">
          {
            members && members.map((item) => {
              return (
                <View className="members-item">
                  <Image className="members-item-avatar" src={item.avatar_url} onClick={this.onNavgateUserProfile.bind(this, item)}></Image>
                  <View className="members-item-name">{item.nick_name}
                    {
                      (item.id == app.own.id) &&
                      <View className="members-item-role-label">圈主</View>
                    }
                  </View>
                </View>
              )
            })

          }
        </View>
        <View className="members-bottom">- THE END -</View>
      </View>
    )
  }
}
export default AppMembers
