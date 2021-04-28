/** @format */

import Taro, {Component, Config} from '@tarojs/taro'
import {View, Input, Form, Button} from '@tarojs/components'
import {connect} from '@tarojs/redux'
// import Api from '../../utils/request'
import Tips from '../../utils/tips'
import {LoginPasswordProps, LoginPasswordState} from './loginPassword.interface'
import './loginPassword.scss'
import {Router} from '../../config/router'

// import {  } from '../../components'

@connect(({loginPassword}) => ({
  ...loginPassword,
}))
class LoginPassword extends Component<LoginPasswordProps, LoginPasswordState> {
  config: Config = {
    navigationBarTitleText: '登录',
  }
  constructor(props: LoginPasswordProps) {
    super(props)
    this.state = {}
  }

  componentDidMount() {}

  register() {
    Router.navigateTo(Router.REGISTER)
  }

  login(e) {
    let {cellphone, password} = e.detail.value
    if (cellphone.length < 11) {
      Tips.failure('非法的手机号码')
      return true
    }

    if (password.length == 0) {
      Tips.failure('密码不能为空')
      return true
    }

    this.props.dispatch({
      type: 'user/login',
      payload: {
        cellphone: cellphone,
        password: password
      },
    })
  }

  render() {
    return (
      <View className="container">
        <View className="form">
          <Form onSubmit={this.login.bind(this)}>
            <View className="slj-group">
              <View className="slj-label">手机号</View>
              <View className="slj-input">
                <Input name="cellphone" type="text" placeholder="请输入账号" maxLength="11" />
              </View>
            </View>
            <View className="slj-group pwd">
              <View className="slj-label">密码</View>
              <View className="slj-input">
                <Input name="password" type="password" password placeholder="请输入密码" />
              </View>
            </View>
            <Button className="btn login-button" formType="submit">
              登录
            </Button>
            <View className="link register" onClick={this.register.bind(this)}>
              手机号注册
            </View>
          </Form>
        </View>
      </View>
    )
  }
}
export default LoginPassword
