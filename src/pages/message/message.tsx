
import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import './message.scss'
import { BaseProps } from '../../utils/base.interface'
import { J2ListItem } from '../../components'
import { Router } from '../../config/router'
import Model from '../../utils/model'
import EventCenter from '../../utils/event-center'
import AppUtils from '../../utils/app-utils'
import {globalData} from '../../utils/common'
/**
 * message.state 参数类型
 *
 * @export
 * @interface MessageState
 */
export interface MessageState { }

/**
 * message.props 参数类型
 *
 * @export
 * @interface MessageProps
 */
export interface MessageProps extends BaseProps {
  unread_counts: Model.UnreadCounts | null
}

@connect(({ message, entities, loading }) => ({
  ...message,
  entities: entities,
  loading: loading.models.message
}))

class Message extends Component<MessageProps, MessageState> {
  config: Config = {
    navigationBarTitleText: '消息'
  }
  constructor(props: MessageProps) {
    super(props)
    this.state = {}
  }

  async componentWillMount() {
    await this.getUnreadCounts()
    AppUtils.uploadBadge()
    Taro.eventCenter.on(EventCenter.READ_MESSAGE_SUCCESS, () => {
      this.onPullDownRefresh()
    });
  }
  componentDidShow() {
    AppUtils.uploadBadge()
  }

  componentWillUnmount() {
    Taro.eventCenter.off(EventCenter.READ_MESSAGE_SUCCESS)
  }


  static defaultProps: MessageProps = {
    unread_counts: null
  }

  onPullDownRefresh() {
    this.getUnreadCounts()
  }

  async getUnreadCounts() {
    globalData.unread_counts = await this.props.dispatch({
      type: 'message/getUnreadCounts',
      payload: {
      },
    })
  }


  componentDidMount() {

  }

  onNavgateLike() {
    Router.navigateTo(Router.LIKE_MESSAGES)
  }

  onNavgateComment() {
    Router.navigateTo(Router.COMMENT_MESSAGES)
  }

  render() {
    const { unread_counts, loading } = this.props

    return (
      <View className='container'>
        <View className="message">
          <J2ListItem label="点赞" leftIconText="icon-good" onClick={this.onNavgateLike.bind(this)} badge={unread_counts ? unread_counts.likes_unread_count : 0} />
          <J2ListItem label="评论" leftIconText="icon-comments" onClick={this.onNavgateComment.bind(this)} badge={unread_counts ? unread_counts.comments_unread_count : 0} />
        </View>
      </View>
    )
  }
}
export default Message
