/** @format */

import Taro, {Component, Config,useReachBottom} from '@tarojs/taro'
import {View} from '@tarojs/components'
import {connect} from '@tarojs/redux'
import './like-messages.scss'
import {BaseProps} from '../../utils/base.interface'
import {J2Message} from '../../components'
import Model from '../../utils/model'
import {message} from '../../models/schema'
import {denormalize} from 'normalizr'
import TimeHelper from '../../utils/time-helper'
/**
 * likeMessages.state 参数类型
 *
 * @export
 * @interface LikeMessagesState
 */
export interface LikeMessagesState {
  page: number
}

/**
 * likeMessages.props 参数类型
 *
 * @export
 * @interface LikeMessagesProps
 */
export interface LikeMessagesProps extends BaseProps {
  messages: Array<Model.Notification>
  isLast: boolean
  entities?: object
}

@connect(({likeMessages, entities, loading}) => ({
  ...likeMessages,
  entities: entities,
  loading: loading.models.likeMessages,
}))
class LikeMessages extends Component<LikeMessagesProps, LikeMessagesState> {
  config: Config = {
    navigationBarTitleText: '赞',
    enablePullDownRefresh: true,
  }
  constructor(props: LikeMessagesProps) {
    super(props)
    this.state = {
      page: 1,
    }
  }

  componentWillMount() {
    this.getMessages()
    setTimeout(() => { this.readMessage() },1000)     // ✓ 正确
  }

  static defaultProps: LikeMessagesProps = {
    isLast: false,
    messages: []
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

  getUnReadMessageIds() {
    return denormalize(this.props.messages, [message], this.props.entities).filter(item => {
      return (item.read == false)
    }).map((item) => item.id)
  }


  async readMessage() {
    let ids = this.getUnReadMessageIds()
    if(ids && ids.length > 0) {
      await this.props.dispatch({
        type: 'likeMessages/readMessages',
        payload: {
          ids: this.getUnReadMessageIds()
        },
      })
    }
  }

  async getMessages() {
    await this.props.dispatch({
      type: 'likeMessages/getMessages',
      payload: {
        page: this.state.page
      },
    })
  }

  componentDidMount() {}


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
        <View className="like-messages">
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
export default LikeMessages
