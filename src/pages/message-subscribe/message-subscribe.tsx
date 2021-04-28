
import Taro, { Component, Config } from '@tarojs/taro'
import { View,Button,Text,Image } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import Api from '../../utils/request'
import './message-subscribe.scss'
import { BaseProps } from '../../utils/base.interface'
import Tips from '../../utils/tips'
import Permissions from '../../utils/permissions'
/**
 * message-subscribe.state 参数类型
 *
 * @export
 * @interface Message-subscribeState
 */
export interface MessageSubscribeState { }

/**
 * messageSubscribe.props 参数类型
 *
 * @export
 * @interface MessageSubscribeProps
 */
export interface MessageSubscribeProps extends BaseProps { }

@connect(({ messageSubscribe, entities, loading }) => ({
  ...messageSubscribe,
  entities: entities,
  loading: loading.models.messageSubscribe
}))

class MessageSubscribe extends Component<MessageSubscribeProps, MessageSubscribeState> {
  config: Config = {
    navigationBarTitleText: '订阅消息通知'
  }
  constructor(props: MessageSubscribeProps) {
    super(props)
    this.state = {}
  }

  componentDidMount() {

  }

  onMessageSubscribe() {
    console.log("onMessageSubscribe")
    Permissions.subscribe(()=>{
      Tips.success("订阅成功")
    },()=>{
      Tips.failure("订阅失败")
    })
  }

  render() {
    return (
      <View className='container'>
        <View className="msg-header">
        <Image className="msg-img" src="https://shuoliangju-cn.oss-cn-qingdao.aliyuncs.com/production/config/IMG_3608.JPG" mode="aspectFit"></Image>
        </View>
        <View className="title">圈子更新提醒</View>
        <View className="body"><Text>订阅通知后，有新的点赞、留言、评论等消息我们可以第一时间告知你</Text></View>
        <View className="body2"><Text>订阅通知的具体操作只需简单的三步：点击下方的订阅消息通知按钮-在弹出框中勾选“总是保持以上选择，不在询问” - 最后点击按钮允许</Text></View>
        <Button className="btn sub-btn" onClick={this.onMessageSubscribe.bind(this)}>
          订阅消息通知
          </Button>
      </View>
    )
  }
}
export default MessageSubscribe
