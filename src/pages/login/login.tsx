/** @format */

import Taro, { Component, Config } from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import { connect } from '@tarojs/redux'
// import Api from '../../utils/request'
// import Tips from '../../utils/tips'
import './login.scss'
import { globalData } from '../../utils/common'
import { Router } from '../../config/router'
import Tips from '../../utils/tips'
import EventCenter from '../../utils/event-center'
import { BaseProps } from '../../utils/base.interface'

/**
 * login.state 参数类型
 *
 * @export
 * @interface LoginState
 */
export interface LoginState {
  code: string | null
  submited: boolean
}

/**
 * login.props 参数类型
 *
 * @export
 * @interface LoginProps
 */
export interface LoginProps extends BaseProps {
  user: any
  hasLogin: boolean
}


@connect(({ user, entities, loading }) => ({
  ...user,
  entities: entities,
  loading: loading.models.user,
}))
class Login extends Component<LoginProps, LoginState> {
  config: Config = {
    navigationBarTitleText: '登录',
  }

  retry: number

  constructor(props: LoginProps) {
    super(props)
    this.state = {
      code: null,
      submited: false
    }
    this.retry = 0
  }

  componentWillMount() {
    Taro.eventCenter.on(EventCenter.LOGIN_SUCCESS, () => {
      Router.back()
    })

    Taro.login().then(res => {
      if (res.code) {
        this.setState({
          code: res.code
        })
      }
    })
  }


  componentWillUnmount() {
    Taro.eventCenter.off(EventCenter.LOGIN_SUCCESS)
  }

  wechatLogin(e) {
    this.setState({
      submited: true
    })
    Tips.loading('登录中')
    Taro.checkSession()
      .then(async (res) => {
        console.log(res)
        await this.props.dispatch({
          type: 'user/wechatLogin',
          payload: {
            code: this.state.code,
            encryptedData: e.detail.encryptedData,
            iv: e.detail.iv
          },
        })
        this.setState({
          submited: false
        },()=>{
          Tips.loaded()
        })
      }).catch((err) => {
        if (this.retry > 3) {
          Tips.failure('登录失败！' + err.errMsg)
          this.setState({
            submited: false
          },()=>{
            Tips.loaded()
          })
          return
        } else {
          this.retry++
        }
        this.wechatLogin(e)
      })
  }

  bindGetUserInfo(e) {
    if (e.detail.userInfo) {
      globalData.userInfo = e.detail.userInfo //用户微信信息
      this.wechatLogin(e)
    } else {
      console.log('用户点击了“拒绝授权”')
    }
  }

  loginPassword() {
    Router.navigateTo(Router.LOGIN_PASSWORD)
  }

  render() {
    const { submited} = this.state
    return (
      <View className="container">
        <View className="user">
          <Button className="btn wechat-btn" onGetUserInfo={this.bindGetUserInfo.bind(this)} open-type="getUserInfo" disabled={submited}>
            微信用户一键登录
          </Button>
        </View>

        <View className="privacy">
          {/* 登录注册代表你同意说两句 */}
          {/* <View className="link">《服务协议》</View>与<View className="link">《隐私政策》</View> */}
        </View>
      </View>
    )
  }
}
export default Login
