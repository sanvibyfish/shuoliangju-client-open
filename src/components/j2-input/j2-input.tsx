import Taro, { Component } from '@tarojs/taro'
import { View, Input } from '@tarojs/components'
import './j2-input.scss'
/**
 * j2-input.state 参数类型
 *
 * @export
 * @interface J2-inputState
 */
export interface J2InputState {
  value: string
 }

/**
 * j2Input.props 参数类型
 *
 * @export
 * @interface J2InputProps
 */
export interface J2InputProps {
  label: string
  placeholder: string
  name: string
  type: string
  style: string
}
class J2Input extends Component<J2InputProps, J2InputState> {
  constructor(props: J2InputProps) {
    super(props)
    this.state = {
      value: ""
    }
  }
  static behaviors = ['wx://form-field']

  static options = {
    addGlobalClass: true
  }
  static defaultProps: J2InputProps = {
    label: "",
    placeholder: "",
    name: "",
    type: 'text',
    style: ""
  }

  setValue(e){
    this.setState({
      value: e.detail.value
    })
  }

  render() {
    const { label, placeholder, name,type,style } = this.props
    return (
      <View className='j2-inputs' style={style}>
        <View className="j2-inputs-label">{label}</View>
        <Input className="j2-inputs-value" type={type} placeholder={placeholder} name={name} onInput={this.setValue.bind(this)} />
      </View>
    )
  }
}

export default J2Input
