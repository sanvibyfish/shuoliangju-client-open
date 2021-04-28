
import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import Api from '../../utils/request'
import './user-info.scss'
import { BaseProps } from '../../utils/base.interface'
import { J2ListItem } from '../../components'
import { Router } from '../../config/router'
import EntityUtils from '../../utils/entity_utils'
import Tips from '../../utils/tips'
import { globalData } from '../../utils/common'
/**
 * user-info.state 参数类型
 *
 * @export
 * @interface User-infoState
 */
export interface UserInfoState {
  userId: string | null
}

/**
 * userInfo.props 参数类型
 *
 * @export
 * @interface UserInfoProps
 */
export interface UserInfoProps extends BaseProps { }

@connect(({ userInfo, entities, loading }) => ({
  ...userInfo,
  entities: entities,
  loading: loading.models.userInfo
}))

class UserInfo extends Component<UserInfoProps, UserInfoState> {
  config: Config = {
    navigationBarTitleText: '用户信息'
  }
  constructor(props: UserInfoProps) {
    super(props)
    this.state = {
      userId: null
    }
  }

  componentWillMount() {
    let params = Router.getParams(this.$router.params)
    this.setState({
      userId: params.userId
    })
  }
  componentDidMount() {

  }


  onCopyClipboard(str) {
    Taro.setClipboardData({
      data: str,
      success: function (res) {
        Tips.success("已复制粘贴板")
      }
    })
  }

  render() {
    const { userId } = this.state
    const { entities } = this.props
    let user = EntityUtils.getUser(entities, userId)
    return (
      <View className='container'>
        <View className='user-info'>
          <View className="title">基本信息</View>
          <View className="profile-item">
            <J2ListItem label="头像" image={user ? user.avatar_url : ''} arrow={false}/>
            <J2ListItem label="昵称" value={user ? user.nick_name : ''}  arrow={false}/>
            <J2ListItem label="简介" value={user ? user.summary : ''}  arrow={false}/>
            <J2ListItem label="微信号" value={user ? user.wechat : ''}  arrow={false}/>
            <J2ListItem label="身份介绍" value={user ? user.identity : ''}  arrow={false}/>
            <J2ListItem label="学校" value={user ? user.school : ''}  arrow={false}/>
            <J2ListItem label="公司" value={user ? user.company : ''}  arrow={false}/>
            <J2ListItem label="公司地址" value={user ? user.company_address : ''}  arrow={false}/>
            <J2ListItem label="邮箱" value={user ? user.email : ''}  arrow={false}/>
            <J2ListItem label="性别" value={user && user.gender == 1 ? '男' : '女'} arrow={false} />

            <J2ListItem
              label="地区"
              arrow={false}
              value={`${user && user.city ? user.city : ''} ${
                user && user.prefecture ? user.prefecture : ''
                }`}></J2ListItem>
          </View>

          <View className="title">社交媒体</View>
          <View className="profile-item">
            <J2ListItem label="头条号" value={(user && user.toutiao) ? '已绑定' : ''}  onClick={user && this.onCopyClipboard.bind(this,user.toutiao)}/>
            <J2ListItem label="公众号" value={ (user && user.wechat_mp) ? '已绑定' : ''}   onClick={user && this.onCopyClipboard.bind(this,user.wechat_mp)}/>
            <J2ListItem label="Bilibili" value={ (user && user.bilibili) ? '已绑定' : ''}   onClick={user && this.onCopyClipboard.bind(this,user.bilibili)}/>
            <J2ListItem label="微博" value={(user && user.weibo) ? '已绑定': ''}  onClick={user && this.onCopyClipboard.bind(this,user.weibo)} />
          </View>
        </View>
      </View>
    )
  }
}
export default UserInfo
