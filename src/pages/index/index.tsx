
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import './index.scss'
import { BaseProps } from '../../utils/base.interface'
import { Router } from '../../config/router'
import { AppModel } from '../../models/data/model'
import EntityUtils from '../../utils/entity_utils'
import EventCenter from '../../utils/event-center'
import { globalData } from '../../utils/common'
import Tips from '../../utils/tips'
import Permissions from '../../utils/permissions'
import AppUtils from '../../utils/app-utils'
/**
 * index.state 参数类型
 *
 * @export
 * @interface IndexState
 */
export interface IndexState {
  page: number
  userId: string | null
}

/**
 * index.props 参数类型
 *
 * @export
 * @interface IndexProps
 */
export interface IndexProps extends BaseProps {
  appIds: AppModel[]
  entities: any
}

@connect(({ app, entities, loading }) => ({
  ...app,
  entities: entities,
  loading: loading.models.app
}))
class Index extends Component<IndexProps, IndexState> {
  config: Config = {
    navigationBarTitleText: '社区'
  }
  constructor(props: IndexProps) {
    super(props)
    this.state = {
      page: 1,
      userId: null
    }
  }

  componentDidMount() {

  }

  componentDidShow() {
    AppUtils.uploadBadge()
  }

  async componentWillMount() {
    let params = Router.getParams(this.$router.params)
    this.setState({
      userId: params.userId
    },()=>{
      this.getApps()
    })
    await this.getUnreadMessage()
    AppUtils.uploadBadge()
    Taro.eventCenter.on(EventCenter.CREATE_APP_SUCCESS, () => {
      this.onPullDownRefresh()
    })
    Taro.eventCenter.on(EventCenter.UPDATE_APP_SUCCESS, () => {
      this.onPullDownRefresh()
    })
    Taro.eventCenter.on(EventCenter.EXIT_APP_SUCCESS, () => {
      this.onPullDownRefresh()
    })
    Taro.eventCenter.on(EventCenter.LOGIN_SUCCESS, () => {
      this.onPullDownRefresh()
    })
    Taro.eventCenter.on(EventCenter.LOGOUT_SUCCESS, () => {
      this.onPullDownRefresh()
    })
    Taro.eventCenter.on(EventCenter.CONFIG_UPDATE, () => {
      this.onPullDownRefresh()
    })

    Taro.eventCenter.on(EventCenter.FETCH_UNREAD_MESSAGES, (response) => {
      globalData.unread_counts = response
    })

    
  }

  componentWillUnmount() {
    Taro.eventCenter.off(EventCenter.CREATE_APP_SUCCESS)
    Taro.eventCenter.off(EventCenter.UPDATE_APP_SUCCESS)
    Taro.eventCenter.off(EventCenter.EXIT_APP_SUCCESS)
    Taro.eventCenter.off(EventCenter.LOGIN_SUCCESS)
    Taro.eventCenter.off(EventCenter.LOGOUT_SUCCESS)
    Taro.eventCenter.off(EventCenter.CONFIG_UPDATE)
    Taro.eventCenter.off(EventCenter.FETCH_UNREAD_MESSAGES)
  }

  async getApps() {
    await this.props.dispatch({
      type: 'app/getApps',
      payload: {
        target_user_id: this.state.userId,
        page: this.state.page
      },
    })
  }

  async getUnreadMessage() {
    globalData.unread_counts = await this.props.dispatch({
      type: 'message/getUnreadCounts',
      payload: {
      },
    })
  }

  onPullDownRefresh() {
    this.setState(
      {
        page: 1,
      },
      async () => {
        this.getApps()
        this.getUnreadMessage()
      },
    )
  }

  onAppHelp() {
    if (globalData.config) {
      Taro.navigateTo({ url: globalData.config.help_url })
    } else {
      Tips.toast('请联系【微信号:sanvibyfish】咨询')
    }
  }

  onShareAppMessage() {
    return {
      title: `卢灿伟Sanvi`,
    }
  }

  onNavgateToHome(appId) {
    Permissions.subscribe(() => {
      Router.navigateTo(Router.HOME, {
        appId: appId
      })
    }, () => {
      Router.navigateTo(Router.HOME, {
        appId: appId
      })
    })
  }

  onNavgateCreateApp() {
    Router.navigateTo(Router.CREATE_APP)
  }


  render() {
    const { entities, appIds } = this.props
    let apps = EntityUtils.getApps(entities, appIds)

    return (
      <View className={`container`}>

        <View className="app-list">
          {
            apps && apps.map((item) => (
              <View className="app-list-app" onClick={this.onNavgateToHome.bind(this, item.id)}>
                <Image src={`${item.logo_url}?x-oss-process=image/resize,m_fill,h_120`} className="app-list-app-logo" mode="scaleToFill"></Image>
                <View className="app-list-app-name">{item.name}</View>
              </View>
            ))
          }
          {
            (globalData.userInfo && globalData.userInfo.actions.includes("create_app")) &&
            (
              <View className="app-list-app-add" onClick={this.onNavgateCreateApp.bind(this)}>
                <Text className="iconfont icon-add app-list-app-add-icon"></Text>
                <View>创建圈子</View>
              </View>
            )
          }
        </View>
      </View>
    )
  }
}
export default Index
