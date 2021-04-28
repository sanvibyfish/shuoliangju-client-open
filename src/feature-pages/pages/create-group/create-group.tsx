
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text,Form, Button} from '@tarojs/components'
import { connect } from '@tarojs/redux'
import Api from '../../../utils/request'
import './create-group.scss'
import { BaseProps } from '../../../utils/base.interface'
import { J2ListItem, J2Input } from '../../../components'
import { Router } from '../../../config/router'
import Tips from '../../../utils/tips'
/**
 * create-group.state 参数类型
 *
 * @export
 * @interface Create-groupState
 */
export interface CreateGroupState {
  group: object
  input: any
  groupId: number | null
  qrcode: string | null
  logo: string | null
  submited: boolean
}

/**
 * createGroup.props 参数类型
 *
 * @export
 * @interface CreateGroupProps
 */
export interface CreateGroupProps extends BaseProps { }

@connect(({ createGroup, entities, loading }) => ({
  ...createGroup,
  entities: entities,
  loading: loading.models.createGroup
}))

class CreateGroup extends Component<CreateGroupProps, CreateGroupState> {
  config: Config = {
    navigationBarTitleText: '创建群信息'
  }
  
  constructor(props: CreateGroupProps) {
    super(props)
    this.state = {
      groupId: null,
      input: {
        back: false
      },
      group: {
        summary: '',
        group_own_wechat: ''
      },
      qrcode: null,
      logo: null,
      submited: false
      
    }
  }

  onChangeSummary() {
    Router.navigateTo(Router.INPUT_FORM, {
      value: this.state.group.summary,
      key: "summary",
      title: '设置描述',
    })
  }

  onChangeOwnWechat() {
    Router.navigateTo(Router.INPUT_FORM, {
      value: this.state.group.group_own_wechat,
      key: "group_own_wechat",
      title: '设置备用微信号',
    })
  }

  componentWillMount() {
    let params = Router.getParams(this.$router.params)
  }

  componentDidShow() {
    if (this.state.input && this.state.input.back) {
      this.setState({
        input: {
          back: false,
        },
        group: {
          ...this.state.group,
          summary: this.state.input.key == "summary" ? this.state.input.value : this.state.group.summary,
          group_own_wechat: this.state.input.key == "group_own_wechat" ? this.state.input.value : this.state.group.group_own_wechat,
        },
      })
    }
  }

  async onSubmit(e) {
    let logo, qrcode
    const {name} = e.detail.value
    Tips.loading("提交中")
    this.setState({
      submited: true
    })
    if(this.state.logo) {
      const attachment = await this.props.dispatch({
        type: 'attachment/upload',
        payload: {
          filePath: this.state.logo,
        },
      })

      if(attachment) {
        logo = attachment.blob_id
      }
    } 

    if(!logo) {
      Tips.failure('请上传封面图')
      this.setState({
        submited: false
      })
      return null
    }


    if(this.state.qrcode) {
      const attachment = await this.props.dispatch({
        type: 'attachment/upload',
        payload: {
          filePath: this.state.qrcode,
        },
      })
      if(attachment) {
        qrcode = attachment.blob_id
      }
    } 


    if(!qrcode) {
      Tips.failure('请上传加群二维码')
      this.setState({
        submited: false
      })
      return null
    }


    let response = await this.props.dispatch({
      type: 'group/createGroup',
      payload: {
        ...this.state.group,
        logo: logo,
        qrcode: qrcode,
        name: name
      }
    })
    this.setState({
      submited: false
    })
    if(response){
      Router.back()
    }

 
  } 




  onQrcodeChange() {
    Taro.chooseImage({count: 1}).then(res => {
      if (res.tempFilePaths) {
        this.setState({
          qrcode: res.tempFilePaths[0],
        })
      }
    })
  }


  onLogoChange() {
    Taro.chooseImage({count: 1}).then(res => {
      if (res.tempFilePaths) {
        this.setState({
          logo: res.tempFilePaths[0],
        })
      }
    })
  }



  render() {
    const { group,qrcode,logo,submited } = this.state
    return (
      <View className='container'>
        <View className="create-group">
          {/* <View className='create-group-item'>
            <View className='create-group-item-label'>加群方式</View>
            <View  className='create-group-item-value'>
              <View className="create-group-item-value-btn create-group-item-value-btn-left create-group-item-value-btn-active">按钮</View>
              <View className="create-group-item-value-btn">扫码</View>
            </View>
          </View> */}
        <Form onSubmit={this.onSubmit.bind(this)}>
          <J2Input label="群名称" placeholder="群名称" name="name" />
          <J2ListItem label="群描述" onClick={this.onChangeSummary.bind(this)} value={group.summary ? group.summary : ''}></J2ListItem>
          <View className="create-group-tips">
            <View>描述话题、主旨、内容可以触达更多精准用，如果非微信群，请注明</View>
          </View>
          <J2ListItem label="加群二维码" onClick={this.onQrcodeChange.bind(this)} image={qrcode ? qrcode : null}></J2ListItem>
          <View className="create-group-tips">
            <View>1.推荐：若群已超过200人，上传你或者邀请人的二维码</View>
            <View>2.若目前群人数小于200人，可上传微信群二维码（但7天后过去，需手动更新）</View>
            <View>3.企业微信群二维码不会过期</View>
          </View>
          <J2ListItem label="群封面" onClick={this.onLogoChange.bind(this)} image={logo ? logo : null}></J2ListItem>
          <J2ListItem label="备用微信号" onClick={this.onChangeOwnWechat.bind(this)} value={group.group_own_wechat ? group.group_own_wechat : ''}></J2ListItem>
          <View className="create-group-tips">
            <View>微信号或者手机号，以防二维码失效</View>
          </View>
          <Button className="btn create-group-save"  formType="submit"  disabled={submited}>保存</Button>
          </Form>
        </View>
      </View>
    )
  }
}
export default CreateGroup
