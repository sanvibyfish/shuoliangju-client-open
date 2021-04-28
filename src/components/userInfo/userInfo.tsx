/** @format */

import Taro, {Component} from '@tarojs/taro'
import {View, Text, Image} from '@tarojs/components'
import './userInfo.scss'
import TimeHelper from '../../utils/time-helper'
import { Router } from '../../config/router'
/**
 * userInfo.state 参数类型
 *
 * @format
 * @export
 * @interface UserInfoState
 */

export interface UserInfoState {}

/**
 * userInfo.props 参数类型
 *
 * @export
 * @interface UserInfoProps
 */
export interface UserInfoProps {
  user: any
  created_at: string,
  isOwn: boolean
  isGrade: boolean
}

class UserInfo extends Component<UserInfoProps, UserInfoState> {
  constructor(props: UserInfoProps) {
    super(props)
    this.state = {}
  }
  static options = {}
  static defaultProps: UserInfoProps = {
    user: null,
    created_at: '',
    isOwn: false,
    isGrade: false
  }

  onNavgateUserProfile() {
    Router.navigateTo(Router.USER_PROFILE, {
      userId: this.props.user.id,
      title: this.props.user.nick_name
    })
  }

  render() {
    const {user,isOwn,isGrade} = this.props
    return (
      <View className="info">
        <Image className="avatar" mode="scaleToFill" src={this.props.user ? this.props.user.avatar_url : ''} onClick={this.onNavgateUserProfile.bind(this)}></Image>
        <View className="text-view">
          <View className="name">
            {user.nick_name}
            {
              isOwn &&
              <View className="name-role-label">圈主</View>
            }
            {
              isGrade &&
              <View className="name-grade-label">精华</View>
            }
          </View>
          <Text className="time">{new TimeHelper().showRelativeTime(Number(this.props.created_at))}</Text>
        </View>
      </View>
    )
  }
}

export default UserInfo
