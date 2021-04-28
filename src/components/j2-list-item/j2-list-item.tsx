/** @format */

import Taro, {Component} from '@tarojs/taro'
import {View, Text,Image} from '@tarojs/components'
import './j2-list-item.scss'

declare namespace J2ListItem {
  /**
   * item.state 参数类型
   *
   * @export
   * @interface ItemState
   */
  interface ItemState {}

  /**
   * item.props 参数类型
   *
   * @
   * @interface ItemProps
   */
  interface ItemProps {
    label?: string
    arrow?: boolean
    value?: string
    image?: string
    leftIconText?: string
    onClick?(): any
    badge: number
    textColor: string | null
  }
}

class J2ListItem extends Component<J2ListItem.ItemProps, J2ListItem.ItemState> {
  constructor(props: J2ListItem.ItemProps) {
    super(props)
    this.state = {}
  }
  static options = {
    addGlobalClass: true,
  }
  static defaultProps: J2ListItem.ItemProps = {
    arrow: true,
    value: '',
    badge: 0,
    textColor: null
  }

  onItemClick(e) {
    this.props.onClick && this.props.onClick()
  }

  render() {
    const {label, value, arrow, image, leftIconText, badge,textColor} = this.props
    let textStyle = `color:${textColor}`
    return (
      <View className="j2-item" onClick={this.onItemClick.bind(this)}>
        <View className="j2-item-label" style={`${textColor ? textStyle : ''}`}>
          {leftIconText && <Text className={`iconfont ${leftIconText} j2-item-label-icon`}></Text>}
          {label}
        </View>
        <View className={`j2-item-value ${!arrow ? "pr-8":""}`} style={`${textColor ? textStyle : ''}`}>
          {value ? value : ''}
          {image && <Image className="j2-item-value-avatar" mode="scaleToFill" src={image}></Image>}
          {badge != 0 && <View className="j2-item-value-badge">{badge}</View>}
          {arrow && <Text className="iconfont icon-arrow-right j2-item-value-icon" />}
        </View>
      </View>
    )
  }
}

export default J2ListItem
