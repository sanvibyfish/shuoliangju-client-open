/** @format */

import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Picker } from '@tarojs/components'
import { connect } from '@tarojs/redux'
// import Api from '../../utils/request'
// import Tips from '../../utils/tips'
import './profile.scss'
import { logout, globalData } from '../../utils/common'
import { Router } from '../../config/router'
import { J2ListItem } from '../../components'
import { BaseProps } from '../../utils/base.interface'
import Model from '../../utils/model'
import { user } from 'src/models/schema'
import Tips from '../../utils/tips'
/**
 * profile.state 参数类型
 *
 * @export
 * @interface ProfileState
 */
export interface ProfileState {
  user: Model.User
  genderSelector: string[]
  callbackNickName: string
  input: any
  avatar: string
}

/**
 * profile.props 参数类型
 *
 * @export
 * @interface ProfileProps
 */
export interface ProfileProps extends BaseProps {
}

@connect(({ profile, entities, loading }) => ({
  ...profile,
  entities: entities,
  loading: loading.models.profile,
}))

class Profile extends Component<ProfileProps, ProfileState> {
  config: Config = {
    navigationBarTitleText: '个人设置',
  }
  constructor(props: ProfileProps) {
    super(props)
    this.state = {
      user: null,
      genderSelector: ['男', '女'],
      input: null,
    }
  }
  static defaultProps: ProfileProps = {
  }

  onGenderChange(e) {
    this.setState({
      user: {
        ...this.state.user,
        gender: this.state.genderSelector[e.detail.value] == '男' ? 1 : 2,
      },
    })

    console.log()
  }

  onChange(e) {
    console.log(e)
    if (e.detail) {
      this.setState({
        user: {
          ...this.state.user,
          province: e.detail.value[0],
          city: e.detail.value[1],
          prefecture: e.detail.value[2],
        },
      })
    }
  }
  componentDidShow() {
    if (this.state.input && this.state.input.back) {
      this.setState({
        input: {
          back: false,
        },
        user: {
          ...this.state.user,
          summary: this.state.input.key == "summary" ? this.state.input.value : this.state.user.summary,
          nick_name: this.state.input.key == "nick_name" ? this.state.input.value : this.state.user.nick_name,
          wechat: this.state.input.key == "wechat" ? this.state.input.value : this.state.user.wechat,
          identity: this.state.input.key == "identity" ? this.state.input.value : this.state.user.identity,
          school: this.state.input.key == "school" ? this.state.input.value : this.state.user.school,
          company: this.state.input.key == "company" ? this.state.input.value : this.state.user.company,
          company_address: this.state.input.key == "company_address" ? this.state.input.value : this.state.user.company_address,
          email: this.state.input.key == "email" ? this.state.input.value : this.state.user.email,
          toutiao: this.state.input.key == "toutiao" ? this.state.input.value : this.state.user.toutiao,
          wechat_mp: this.state.input.key == "wechat_mp" ? this.state.input.value : this.state.user.wechat_mp,
          bilibili: this.state.input.key == "bilibili" ? this.state.input.value : this.state.user.bilibili,
          weibo: this.state.input.key == "weibo" ? this.state.input.value : this.state.user.weibo,
          cellphone: this.state.input.key == "cellphone" ? this.state.input.value : this.state.user.cellphone,
          labels: this.state.input.key == "labels" ? this.state.input.value : this.state.user.labels,
        },
      })
    }
  }

  componentDidMount() { }
  componentWillMount() {
    this.setState({ user: globalData.userInfo })
  }

  onChangeNickName() {
    Router.navigateTo(Router.INPUT_FORM, {
      value: this.state.user.nick_name ? this.state.user.nick_name : '',
      key: "nick_name",
      title: '设置昵称',
    })
  }

  logout() {
    logout(this.props.dispatch)
    Router.back()
  }

  onAvatarChange() {
    Taro.chooseImage({ count: 1 }).then(res => {
      if (res.tempFilePaths) {
        this.setState({
          avatar: res.tempFilePaths[0],
        })
      }
    })
  }

  async onSave() {
    if (this.state.avatar) {
      const attachment = await this.props.dispatch({
        type: 'attachment/upload',
        payload: {
          filePath: this.state.avatar,
        },
      })
      if (!attachment) {
        Tips.failure('发布失败，请稍候重试')
        return null
      } else {
        this.props.dispatch({
          type: 'profile/updateUser',
          payload: {
            ...this.state.user,
            avatar: attachment.blob_id
          }
        })
      }
    } else {
      this.props.dispatch({
        type: 'profile/updateUser',
        payload: this.state.user
      })
    }
  }

  onChangeSummary() {
    Router.navigateTo(Router.INPUT_FORM, {
      value: this.state.user.summary ? this.state.user.summary : '',
      key: "summary",
      title: '设置简介',
    })
  }

  onChangeWechat() {
    Router.navigateTo(Router.INPUT_FORM, {
      value: this.state.user.wechat ? this.state.user.wechat : '',
      key: "wechat",
      title: '设置微信号',
    })
  }

  onChangeIdentity() {
    Router.navigateTo(Router.INPUT_FORM, {
      value: this.state.user.identity ? this.state.user.identity : '',
      key: "identity",
      title: '设置身份介绍',
    })
  }

  onChangeSchool() {
    Router.navigateTo(Router.INPUT_FORM, {
      value: this.state.user.school ? this.state.user.school : '',
      key: "school",
      title: '设置学校',
    })
  }


  onChangeCompany() {
    Router.navigateTo(Router.INPUT_FORM, {
      value: this.state.user.company ? this.state.user.company : '',
      key: "company",
      title: '设置公司',
    })
  }

  onChangeCompanyAddress() {
    Router.navigateTo(Router.INPUT_FORM, {
      value: this.state.user.company_address ? this.state.user.company_address : '',
      key: "company_address",
      title: '设置公司地址',
    })
  }

  onChangeEmail() {
    Router.navigateTo(Router.INPUT_FORM, {
      value: this.state.user.email ? this.state.user.email : '',
      key: "email",
      title: '设置邮箱',
    })
  }

  onChangeToutiao() {
    Router.navigateTo(Router.INPUT_FORM, {
      value: this.state.user.toutiao ? this.state.user.toutiao : '',
      key: "toutiao",
      title: '设置头条号',
    })
  }


  onChangeWechatMp() {
    Router.navigateTo(Router.INPUT_FORM, {
      value: this.state.user.wechat_mp ? this.state.user.wechat_mp : '',
      key: "wechat_mp",
      title: '设置头公众号',
    })
  }

  onChangeBilibili() {
    Router.navigateTo(Router.INPUT_FORM, {
      value: this.state.user.bilibili ? this.state.user.bilibili : '',
      key: "bilibili",
      title: '设置bilibili',
    })
  }

  onChangeWeibo() {
    Router.navigateTo(Router.INPUT_FORM, {
      value: this.state.user.weibo ? this.state.user.weibo : '',
      key: "weibo",
      title: '设置微博',
    })
  }

  onChangeCellphone() {
    Router.navigateTo(Router.INPUT_FORM, {
      value: this.state.user.cellphone ? this.state.user.cellphone : '',
      key: "cellphone",
      title: '设置手机',
    })
  }

  onChangeLabels() {
    Router.navigateTo(Router.INPUT_FORM, {
      value: this.state.user.labels ? this.state.user.labels : '',
      key: "labels",
      title: '设置标签',
    })
  }


  render() {
    const { user, avatar } = this.state
    const { loading } = this.props

    return (
      <View className="container">
        <View className="profile">
          <View className="title">基本信息</View>
          <View className="profile-item">
            <J2ListItem label="头像" image={avatar ? avatar : (user ? user.avatar_url : '')} onClick={this.onAvatarChange.bind(this)} />
            <J2ListItem label="昵称" value={user ? user.nick_name : ''} onClick={this.onChangeNickName.bind(this)} />
            <J2ListItem label="身份" value={user ? user.identity : ''} onClick={this.onChangeIdentity.bind(this)} />
            <J2ListItem label="自我介绍" value={user ? user.summary : ''} onClick={this.onChangeSummary.bind(this)} />
            <J2ListItem label="微信号" value={user ? user.wechat : ''} onClick={this.onChangeWechat.bind(this)} />
            <J2ListItem label="手机" value={user ? user.cellphone : ''} onClick={this.onChangeCellphone.bind(this)} />
            <J2ListItem label="标签" value={user ? user.labels : ''} onClick={this.onChangeLabels.bind(this)} />
            <J2ListItem label="学校" value={user ? user.school : ''} onClick={this.onChangeSchool.bind(this)} />
            <J2ListItem label="公司" value={user ? user.company : ''} onClick={this.onChangeCompany.bind(this)} />
            <J2ListItem label="公司地址" value={user ? user.company_address : ''} onClick={this.onChangeCompanyAddress.bind(this)} />
            <J2ListItem label="邮箱" value={user ? user.email : ''} onClick={this.onChangeEmail.bind(this)} />
            <Picker mode="selector" range={this.state.genderSelector} onChange={this.onGenderChange}>
              <J2ListItem label="性别" value={user && user.gender == 1 ? '男' : '女'} />
            </Picker>

            <Picker mode="region" onChange={this.onChange}>
              <J2ListItem
                label="地区"
                value={`${user && user.city ? user.city : ''} ${
                  user && user.prefecture ? user.prefecture : ''
                  }`}></J2ListItem>
            </Picker>
          </View>

          <View className="title">社交媒体</View>
          <View className="profile-item">
            <J2ListItem label="头条号" value={(user && user.toutiao) ? '已绑定' : ''}  onClick={this.onChangeToutiao.bind(this)} />
            <J2ListItem label="公众号"value={ (user && user.wechat_mp) ? '已绑定' : ''} onClick={this.onChangeWechatMp.bind(this)} />
            <J2ListItem label="Bilibili" value={ (user && user.bilibili) ? '已绑定' : ''} onClick={this.onChangeBilibili.bind(this)} />
            <J2ListItem label="微博" value={(user && user.weibo) ? '已绑定': ''} onClick={this.onChangeWeibo.bind(this)} />
          </View>

    
        </View>
        <View className="btn save" onClick={this.onSave.bind(this)}>
            保存
          </View>
      </View>
    )
  }
}
export default Profile
