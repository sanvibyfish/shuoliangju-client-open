/** @format */

import Taro, {Component} from '@tarojs/taro'
import {View, Text} from '@tarojs/components'
import './j2-radio.scss'

declare namespace J2Radio {
  /**
   * J2Radio.state 参数类型
   *
   * @export
   * @interface J2RadioState
   */
  interface J2RadioState {
    seleted: number | null | undefined
  }

  /**
   * J2Radio.props 参数类型
   *
   * @export
   * @interface J2RadioProps
   */
  interface J2RadioProps {
    options?: Array<Option>
    onItemClick?(detail: J2RadioOnItemClick): any
    value?: string
  }

  interface Option {
    label: string
    value: string
  }

  interface J2RadioOnItemClick {
    option: Option
    index: number
  }
}

class J2Radio extends Component<J2Radio.J2RadioProps, J2Radio.J2RadioState> {
  constructor(props: J2Radio.J2RadioProps) {
    super(props)
    if (props.value && props.options) {
      let index = props.options.findIndex(option => option.value == props.value)
      this.state = {
        seleted: index,
      }
    } else {
      this.state = {
        seleted: null,
      }
    }
  }
  static options = {
    addGlobalClass: true,
  }
  static defaultProps: J2Radio.J2RadioProps = {
    options: [],
  }

  handleItemClick(option, index) {
    this.setState({
      seleted: index,
    })
    this.props.onItemClick && this.props.onItemClick({option: option, index: index})
  }

  render() {
    const {options} = this.props
    const {seleted} = this.state
    return (
      <View className="j2-radio">
        {options &&
          options.map((option, index) => {
            return (
              <View className="j2-radio-item" onClick={this.handleItemClick.bind(this, option, index)}>
                <View className="j2-radio-item-label">{option.label}</View>
                <View className="j2-radio-item-value">
                  {index == seleted && <Text className="iconfont icon-seleted j2-radio-item-value-seleted" />}
                </View>
              </View>
            )
          })}
      </View>
    )
  }
}

export default J2Radio
