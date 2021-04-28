/** @format */

import Taro, {Component, Config} from '@tarojs/taro'
import {View, Textarea, Button,Form} from '@tarojs/components'
import {connect} from '@tarojs/redux'
import Api from '../../utils/request'
import './input-form.scss'
import {BaseProps} from '../../utils/base.interface'
import {Router} from '../../config/router'
import Event from '../../utils/event-center'
/**
 * input-form.state 参数类型
 *
 * @export
 * @interface Input-formState
 */
export interface InputFormState {
  value: string | null
  title: string | null
  placeholder?: string | null
  key: string | null
}

/**
 * inputForm.props 参数类型
 *
 * @export
 * @interface InputFormProps
 */
export interface InputFormProps extends BaseProps {

}

@connect(({inputForm, entities, loading}) => ({
  ...inputForm,
  entities: entities,
  loading: loading.models.inputForm,
}))
class InputForm extends Component<InputFormProps, InputFormState> {
  constructor(props: InputFormProps) {
    super(props)
    this.state = {
      value: null,
      title: null,
      placeholder: null,
      key: null
    }
  }

  onSubmit(e) {
    let {body} = e.detail.value
    Router.back({},{
      input:{
        value: body,
        back: true,
        key: this.state.key
      }
    })
  }

  componentWillMount() {
    let params = Router.getParams(this.$router.params)
    Taro.setNavigationBarTitle({title: params.title})
    this.setState({
      title: params.title,
      placeholder: params.placeholder,
      value: params.value,
      key: params.key
    })
  }

  componentDidMount() {}

  render() {
    const {placeholder, value} = this.state
    return (
      <View className="container">
        <Form onSubmit={this.onSubmit.bind(this)} className="form">
          <View className="form-input-layout">
            <Textarea
            maxlength="-1"
              name="body"
              placeholder={placeholder ? placeholder : ''}
              className="form-input-field"
              value={value ? value : ''}
            />
          </View>
          <Button className="btn form-save" formType="submit">
            保存
          </Button>
        </Form>
      </View>
    )
  }
}
export default InputForm
