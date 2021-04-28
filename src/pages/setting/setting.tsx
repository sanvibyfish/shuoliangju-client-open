
import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import Api from '../../utils/request'
import './setting.scss'
import { BaseProps } from '../../utils/base.interface'
import { J2ListItem } from '../../components'
import { Router } from '../../config/router'
import Tips from '../../utils/tips'
import { globalData, logout } from '../../utils/common'
import EventCenter from '../../utils/event-center'

/**
 * setting.state 参数类型
 *
 * @export
 * @interface SettingState
 */
export interface SettingState {
  modal: boolean
}

/**
 * setting.props 参数类型
 *
 * @export
 * @interface SettingProps
 */
export interface SettingProps extends BaseProps { 
  hasLogin: boolean
}

@connect(({ setting, user, entities, loading }) => ({
  ...setting,
  ...user,
  entities: entities,
  loading: loading.models.setting
}))

class Setting extends Component<SettingProps, SettingState> {
  config: Config = {
    navigationBarTitleText: '设置',
    usingComponents: {
      "cell": "plugin://chatGroupPlugin/cell"
    }
  }

  defaultProps = {
    hasLoging: false,
  }


  constructor(props: SettingProps) {
    super(props)
    this.state = {
      modal: false
    }
  }



  onNavgateMessageSubscribe() {
    Router.navigateTo(Router.MESSAGE_SUBSCRIBE)
  }


  onNavgateWebview() {
    Router.navigateTo(Router.WEBVIEW_PAGE, {
      url: "https://mp.weixin.qq.com/s/4NgMaZts2E2WIUgaAgYV5A",
      title: "卢灿伟Sanvi"
    })
  }



  onCloseModal() {
    this.setState({
      modal: false
    })
  }

  onOpenModal() {
    this.setState({
      modal: true,
    })
  }
  
  componentWillMount(){
    Taro.eventCenter.on(EventCenter.LOGOUT_SUCCESS, () => {
      Tips.success("退出登录成功")
    })
  }
  componentWillUnmount(){
    Taro.eventCenter.off(EventCenter.LOGOUT_SUCCESS)
  }

  componentDidMount() {

  }

  onCompleteMessage() {
    Tips.toast("发送成功，请在微信服务通知里点击链接入群")
  }

  logout() {
    console.log('call logout')
    logout(this.props.dispatch)
  }

  render() {
    const { modal } = this.state
    return (
      <View className='container'>
        <View className="settings">
          <J2ListItem label="意见反馈" onClick={this.onOpenModal.bind(this)}></J2ListItem>
          <J2ListItem label="订阅消息通知" onClick={this.onNavgateMessageSubscribe.bind(this)}></J2ListItem>
          {
            modal && (
              <View className="settings-feedback"  onClick={this.onCloseModal.bind(this)}>
                <View className="settings-feedback-mask"></View>
                <View className="settings-feedback-mask-content">
                  <View className="settings-feedback-mask-content-padding">
                  <cell plugid='10b792e7e4066f399390c0ca71a714c3' onCompletemessage={this.onCompleteMessage.bind(this)}/>
                  </View>
                </View>
              </View>
            )
          }
          <J2ListItem label="关于我" onClick={this.onNavgateWebview.bind(this)} ></J2ListItem>
        </View>

        {this.props.hasLogin && (
          <View className="btn settings-logout" onClick={this.logout.bind(this)}>
            退出登录
          </View>
        )}
      </View>
    )
  }
}
export default Setting
