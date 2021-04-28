/** @format */

import Taro, {Component, Config} from '@tarojs/taro'
import {View, Form, Input, Button} from '@tarojs/components'
import {connect} from '@tarojs/redux'
// import Api from '../../utils/request'
import Tips from '../../utils/tips'
import {RegisterProps, RegisterState} from './register.interface'
import './register.scss'
import {Router} from '../../config/router'
// import {  } from '../../components'

@connect(({register}) => ({
  ...register,
}))
class Register extends Component<RegisterProps, RegisterState> {
  config: Config = {
    navigationBarTitleText: '手机号注册',
  }
  constructor(props: RegisterProps) {
    super(props)
    this.state = {}
  }

  componentDidMount() {}

  handleNavigateLogin() {
    Router.back()
  }

  register(e) {
    let {cellphone, password, passwordConfirm} = e.detail.value
    if (cellphone.length < 11) {
      Tips.failure('非法的手机号码')
      return true
    }

    if (password.length == 0) {
      Tips.failure('密码不能为空')
      return true
    }

    if (passwordConfirm.length == 0) {
      Tips.failure('确认密码不能为空')
      return true
    }

    if (password != passwordConfirm) {
      Tips.failure('两次输入密码不一致')
      return true
    }

    this.props.dispatch({
      type: 'user/register',
      payload: {
        ...e.detail.value,
      },
    })
  }

  render() {
    const {data} = this.props
    return (
      <View className="container">
        <View className="register-form">
          <Form onSubmit={this.register.bind(this)}>
            <View className="slj-group">
              <View className="slj-label">手机号</View>
              <View className="slj-input">
                <Input name="cellphone" type="text" placeholder="请输入账号" maxLength="11" />
              </View>
            </View>
            <View className="slj-group name">
              <View className="slj-label">昵称</View>
              <View className="slj-input">
                <Input name="name" type="text" placeholder="请输入昵称" maxLength="11" />
              </View>
            </View>
            <View className="slj-group pwd">
              <View className="slj-label">密码</View>
              <View className="slj-input">
                <Input name="password" type="password" password placeholder="请输入密码" />
              </View>
            </View>
            <View className="slj-group confirm-pwd">
              <View className="slj-label">确认密码</View>
              <View className="slj-input">
                <Input name="passwordConfirm" type="password" password placeholder="请输入密码" />
              </View>
            </View>
            <Button className="btn register-button" formType="submit">
              注册
            </Button>
            <View className="link login" onClick={this.handleNavigateLogin.bind(this)}>
              登录
            </View>
          </Form>
        </View>
      </View>
    )
  }
}
export default Register
