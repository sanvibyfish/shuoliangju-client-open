
import Taro, { Component, Config, useReachBottom } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import Api from '../../../utils/request'
import './group-list.scss'
import { BaseProps } from '../../../utils/base.interface'
import { Router } from '../../../config/router'
import EntityUtils from '../../../utils/entity_utils'
import { Poster } from '../../../components'
import Tips from '../../../utils/tips'
import { globalData } from '../../../utils/common'
import EventCenter from '../../../utils/event-center'
/**
 * group-list.state 参数类型
 *
 * @export
 * @interface Group-listState
 */
export interface GroupListState {
  appId: number | null
  page: number
  isShareImage: boolean
  shareConfig: any
  userId: string | null
}

/**
 * grouopList.props 参数类型
 *
 * @export
 * @interface GroupListProps
 */
export interface GroupListProps extends BaseProps {
  groupIds: Array<number>
  isLast: boolean
}

@connect(({ groupList, entities, loading }) => ({
  ...groupList,
  entities: entities,
  loading: loading.models.groupList
}))

class GroupList extends Component<GroupListProps, GroupListState> {
  config: Config = {
    navigationBarTitleText: '群信息列表'
  }
  constructor(props: GroupListProps) {
    super(props)
    this.state = {
      appId: null,
      page: 1,
      isShareImage: false,
      shareConfig: null,
      userId: null
    }
  }

  componentDidMount() {

  }

  onPullDownRefresh() {
    this.setState(
      {
        page: 1,
      },
      () => {
        this.getGroups()
      },
    )
  }

  getGroups() {
    this.props.dispatch({
      type: 'groupList/getGroups',
      payload: {
        target_user_id: this.state.userId,
        page: this.state.page
      }
    })
  }


  deleteGroup(id) {
    this.props.dispatch({
      type: 'groupList/destroy',
      payload: {
        id: id
      }
    })
  }


  onCloseShareImage() {
    this.setState({
      isShareImage: false,
    })
  }
  componentWillUnmount() {
    Taro.eventCenter.off(EventCenter.CREATE_GROUP_SUCCESS)
  }

  componentWillMount() {


    let params = Router.getParams(this.$router.params)
    this.setState({
      appId: params.appId,
      userId: params.userId
    }, () => {
      this.onPullDownRefresh()
    })

    Taro.eventCenter.on(EventCenter.CREATE_GROUP_SUCCESS, () => {
      this.onPullDownRefresh()
    })
  }

  onNavgateCreateGroup() {
    Router.navigateTo(Router.CREATE_GROUP, {
      appId: this.state.appId
    })

  }

  onNavgateToGroupDetail(groupId) {
    Router.navigateTo(Router.GROUP_DETAIL, {
      groupId: groupId
    })
  }




  render() {
    const { groupIds, entities, isLast } = this.props
    const { isShareImage, shareConfig, appId } = this.state

    const groups = EntityUtils.getGroups(entities, groupIds)
    let isOwn = false
    const app = EntityUtils.getApp(entities, appId)
    if (app) {
      isOwn = (globalData.userInfo.id == app.own.id)
    }
    const isNotEmpty = (groups && groups.length > 0)
    useReachBottom(() => {
      if (!isLast) {
        this.setState(
          {
            page: this.state.page + 1,
          },
          () => {
            this.onPullDownRefresh()
          },
        )
      }
    })
    return (
      <View className={`${isNotEmpty ? "container" : "empty-container"}`}>
        {
          isNotEmpty ? (
            <View className="group-list">
            {groups.map((group, index) => (
              <View className="group-list-item">
                <View className="group-list-item-header">
                  <View className="group-list-item-header-icon">
                    <Image src={group.logo_url} className="group-list-item-header-icon-img" ></Image>
                  </View>
                  <View className="group-list-item-header-content">
                    <View className="group-list-item-header-content-header">
                      <View className="group-list-item-header-content-header-title">{group.name}</View>
                    </View>
                    <View className="group-list-item-header-content-summary">{group.summary.length > 100 ? `${group.summary.substring(0, 42)}...` : group.summary}</View>
                  </View>
                </View>
                <View className="group-buttons">
                  <View className="join-btn" onClick={this.onNavgateToGroupDetail.bind(this, group.id)}>申请入群</View>
                  {
                    globalData.userInfo.id == this.state.userId && (
                      <View className="del-btn btn" onClick={this.deleteGroup.bind(this,group.id)}>删除</View>
                    )
                  }
                  
                </View>
              </View>
            ))}
            </View>
          ) : (
            <View className="empty-bg">
            <Image src="https://shuoliangju-cn.oss-cn-qingdao.aliyuncs.com/production/config/undraw_chatting_2yvo.png" mode="aspectFit"></Image>
            <View className="empty-bg-tips">还没有创建任何群信息~</View>
          </View>
          )
        }

        {
          globalData.userInfo.id == this.state.userId && (
            <View className="group-create-layout">
            <View className="btn group-create" onClick={this.onNavgateCreateGroup.bind(this)}>创建群信息</View>
            </View>
          )
        }

      </View>
    )
  }
}
export default GroupList
