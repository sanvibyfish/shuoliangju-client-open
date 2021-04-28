/** @format */

import Taro, {Component, Config,useReachBottom} from '@tarojs/taro'
import {View} from '@tarojs/components'
import {connect} from '@tarojs/redux'
import './comment-messages.scss'
import {BaseProps} from '../../utils/base.interface'
import {J2Message} from '../../components'
import Model from '../../utils/model'
import TimeHelper from '../../utils/time-helper'
import {denormalize} from 'normalizr'
import {message} from '../../models/schema'

/**
 * comment-messages.state 参数类型
 *
 * @export
 * @interface CommentMessagesState
 */
export interface CommentMessagesState {
  page: number
}

/**
 * commentMessages.props 参数类型
 *
 * @export
 * @interface CommentMessagesProps
 */
export interface CommentMessagesProps extends BaseProps {
  messages: Array<Model.Notification>
  isLast: boolean
  entities?: object
}

@connect(({commentMessages, entities, loading}) => ({
  ...commentMessages,
  entities: entities,
  loading: loading.models.commentMessages,
}))
class CommentMessages extends Component<CommentMessagesProps, CommentMessagesState> {
  config: Config = {
    navigationBarTitleText: '评论',
    enablePullDownRefresh: true,
  }

  constructor(props: CommentMessagesProps) {
    super(props)
    this.state = {
      page: 1
    }
  }
  componentWillMount() {
    this.getMessages()
    setTimeout(() => { this.readMessage() },1000)     // ✓ 正确
  }
  

  componentDidMount() {}

  static defaultProps: CommentMessagesProps = {
    isLast: false,
    messages: []
  }

  getUnReadMessageIds() {
    return denormalize(this.props.messages, [message], this.props.entities).filter(item => {
      return (item.read == false)
    }).map((item) => item.id)
  }


  onPullDownRefresh() {
    this.setState(
      {
        page: 1,
      },
      () => {
        this.getMessages()
      },
    )
  }



  async readMessage() {
    let ids = this.getUnReadMessageIds()
    if(ids && ids.length > 0) {
      await this.props.dispatch({
        type: 'commentMessages/readMessages',
        payload: {
          ids: ids
        },
      })
    }

  }

  async getMessages() {
    await this.props.dispatch({
      type: 'commentMessages/getMessages',
      payload: {
        page: this.state.page
      },
    })
  }

  render() {
    const {messages,isLast,loading} = this.props
    
    useReachBottom(() => {
      if (!isLast) {
        this.setState(
          {
            page: this.state.page + 1,
          },
          () => {
            this.getMessages()
            setTimeout(() => { this.readMessage() },2000)     // ✓ 正确
          },
        )
      }
    })
    return (
      <View className="container">
        <View className="comment-messages">
          {messages &&
            denormalize(messages, [message], this.props.entities).map(item => {
              return (
                <J2Message
                  message={item}
                />
              )
            })}
        </View>
      </View>
    )
  }
}
export default CommentMessages
