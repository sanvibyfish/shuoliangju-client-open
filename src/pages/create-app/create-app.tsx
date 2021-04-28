
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image, Form, Button } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import './create-app.scss'
import { BaseProps } from '../../utils/base.interface'
import { J2Input } from '../../components'
import Tips from '../../utils/tips'
import { Router } from '../../config/router'

/**
 * create-app.state 参数类型
 *
 * @export
 * @interface Create-appState
 */
export interface CreateAppState {
  logo: string | null
  submited: boolean
}

/**
 * createApp.props 参数类型
 *
 * @export
 * @interface CreateAppProps
 */
export interface CreateAppProps extends BaseProps { }

@connect(({ createApp, entities, loading }) => ({
  ...createApp,
  entities: entities,
  loading: loading.models.createApp
}))

class CreateApp extends Component<CreateAppProps, CreateAppState> {
  config: Config = {
    navigationBarTitleText: '创建圈子'
  }
  constructor(props: CreateAppProps) {
    super(props)
    this.state = {
      logo: null,
      submited: false
    }
  }


  onLogoChange() {
    Taro.chooseImage({ count: 1 }).then(res => {
      if (res.tempFilePaths) {
        this.setState({
          logo: res.tempFilePaths[0],
        })
      }
    })
  }

  async onSubmit(e) {
    let blob_id
    if (!this.state.logo) {
      Tips.failure("请上传封面图片")
      return null
    }
    Tips.loading("提交中")
    this.setState({
      submited: true
    })
    const {name, summary} = e.detail.value
    if (this.state.logo) {
      let attachment = await this.props.dispatch({
        type: 'attachment/upload',
        payload: {
          filePath: this.state.logo,
        },
      })
      if (attachment) {
        blob_id = attachment.blob_id
      }
    } 
    if(blob_id) {
      let response = await this.props.dispatch({
        type: `app/create`,
        payload: {
          name: name,
          summary: summary,
          logo: blob_id
        },
      })
      if(response){
        this.setState({
          logo: null,
        },() => {
          Router.back()
        })
      }
    }
    this.setState({
      submited: false
    })
  }



  render() {
    const { logo,submited } = this.state
    return (
      <View className='container'>
        <View className="create-app">
          <Form onSubmit={this.onSubmit.bind(this)}>
            <View className="create-app-logo" onClick={this.onLogoChange.bind(this)}>
              {
                logo ? (
                  <Image src={logo} mode="aspectFill" className="create-app-logo-img" />
                ) : (
                    <View className="create-app-logo-add">
                      <Text className="iconfont icon-add create-app-logo-add-icon"></Text>
                  封面图片
                    </View>
                  )
              }
            </View>
            <J2Input label="圈子名称" placeholder="想创建什么类型的圈子" name="name"/>
            <J2Input label="圈子描述" placeholder="简单描述你的圈子特色" name="summary"/>
            <Button formType="submit" className="btn create-app-submit"  disabled={submited}>新建圈子</Button>
          </Form>
        </View>
      </View>
    )
  }
}
export default CreateApp
