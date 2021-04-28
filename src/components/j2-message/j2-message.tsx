/** @format */

import Taro, {Component} from '@tarojs/taro'
import {View, Image} from '@tarojs/components'
import './j2-message.scss'
import {Router} from '../../config/router'
import TimeHelper from '../../utils/time-helper'
import { NotificationModel } from '../../models/data/model'
/**
 * j2Message.state 参数类型
 *
 * @export
 * @interface J2MessageState
 */
export interface J2MessageState {}

/**
 * j2Message.props 参数类型
 *
 * @export
 * @interface J2MessageProps
 */
export interface J2MessageProps {
  message: NotificationModel | null
}

class J2Message extends Component<J2MessageProps, J2MessageState> {
  constructor(props: J2MessageProps) {
    super(props)
    this.state = {}
  }
  static options = {
    addGlobalClass: true,
  }
  static defaultProps: J2MessageProps = {
    message: null
  }


  onNavgate(message, e) {
    if(message.resource_type == "Post") {
      Router.navigateTo(Router.POST_DETAIL, {
        postId: message.resource_id,
      })
    } else if(message.resource_type == "Article") {
      Router.navigateTo(Router.ARTICLE_DETAIL, {
        articleId: message.resource_id,
      })
    }
  }


  render() {

    const {message} = this.props
    if (!message) return <View />

    return (
      <View className={`j2-message ${message.read ? 'j2-message-read' : ''}`} onClick={this.onNavgate.bind(this,message)}>
        <View>
        <Image className="j2-message-avatar" mode="aspectFit" src={message.notify_avatar_url}></Image>
        </View>
        <View className="j2-message-info">
          <View className="j2-message-info-title">{message.notify_title}</View>
          <View className="j2-message-info-body">{message.notify_body}</View>
          <View className="j2-message-info-time">{new TimeHelper().showRelativeTime(message.created_at)}</View>
        </View>
      </View>
    )
  }
}

export default J2Message
