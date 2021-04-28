
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Editor, Form, Text, Button } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import Api from '../../utils/request'
import './new-article.scss'
import { BaseProps } from '../../utils/base.interface'
import { J2Input } from '../../components'
import Tips from '../../utils/tips'
import { Router } from '../../config/router'
import EntityUtils from 'src/utils/entity_utils'
/**
 * new-article.state 参数类型
 *
 * @export
 * @interface New-articleState
 */
export interface NewArticleState {
  formatlist: any[],
  editorFormat: object,
  title: string
  isIOS: boolean
  editorHeight: number
  keyboardHeight: number
  appId: number
  logo: string
  submited: boolean
}

/**
 * new-article.props 参数类型
 *
 * @export
 * @interface New-articleProps
 */
export interface NewArticleProps extends BaseProps { }

@connect(({ newArticle, entities, loading }) => ({
  ...newArticle,
  entities: entities,
  loading: loading.models.newArticle
}))

class NewArticle extends Component<NewArticleProps, NewArticleState> {
  config: Config = {
    navigationBarTitleText: '发布文章',
    disableScroll: true
  }
  constructor(props: NewArticleProps) {
    super(props)
    this.state = {
      editorFormat: {},
      formatlist: [{
        style: 'icon-charutupian',
        key: 'img',
        value: ''
      }, {
        style: 'icon-zitijiacu',
        key: 'bold',
        value: 'strong'
      }, {
        style: 'icon-zitixiahuaxian',
        key: 'underline',
        value: true
      },
      {
        style: 'icon-format-header-2',
        key: 'header',
        value: '2'
      },
      {
        style: 'icon-format-header-3',
        key: 'header',
        value: '3'
      },
      {
        style: 'icon-wuxupailie',
        key: 'list',
        value: 'bullet'
      },
      {
        style: 'icon-youxupailie',
        key: 'list',
        value: 'ordered'
      }, 
      {
        style: 'icon-zuoduiqi',
        key: 'align',
        value: 'left'
      }, {
        style: 'icon-juzhongduiqi',
        key: 'align',
        value: 'center'
      }, {
        style: 'icon-youduiqi',
        key: 'align',
        value: 'right'
      },  {
        style: 'icon-zuoyouduiqi',
        key: 'align',
        value: 'justify'
      }],
      title: '',
      editorHeight: 300,
      id: null,
      keyboardHeight: 0,
      isIOS: false,
      submited: false
    }
    this.editorCtx = null; // 编辑器上下文
  }

  componentDidMount() {

  }

  updatePosition(keyboardHeight, scoll: bollean) {
    const toolbarHeight = 50
    const { windowHeight, platform } = Taro.getSystemInfoSync()
    let editorHeight = keyboardHeight > 0 ? (windowHeight - keyboardHeight - toolbarHeight) : windowHeight
    const that = this
    this.setState({ editorHeight, keyboardHeight }, () => {
      if (scoll) {
        that.editorCtx.scrollIntoView()
      }
    })
  }

  componentWillMount() {
    const platform = Taro.getSystemInfoSync().platform
    const isIOS = platform === 'ios'
    this.setState({
      isIOS
    })
    const that = this
    this.updatePosition(0, false)
    let keyboardHeight = 0
    wx.onKeyboardHeightChange(res => {
      if (res.height === keyboardHeight) return
      const duration = res.height > 0 ? res.duration * 1000 : 0
      keyboardHeight = res.height
      setTimeout(() => {
        Taro.pageScrollTo({
          scrollTop: 0,
          success() {
            that.updatePosition(keyboardHeight, true)
          }
        })
      }, duration)
    })
    let params = Router.getParams(this.$router.params)
    this.setState({
      appId: params.appId
    })
  }

  insertImage() {
    const that = this
    Taro.chooseImage({
      count: 1,
      success: async (res) => {
        let response = await this.props.dispatch({
          type: 'attachment/upload',
          payload: {
            filePath: res.tempFilePaths[0],
          },
        })
        if (response) {
          that.editorCtx.insertImage({
            src: response.url,
            width: '80%',
            success: function () {
              console.log('insert image success')
            }
          })
        }
      }

    })
  }

  saveImage(){
    Taro.chooseImage({
      count: 1,
      success: async (res) => {
        this.setState({
          logo: res.tempFilePaths[0]
        })
      }

    })
  }


  handleEditorFormat(item, e: Event) {
    if (item.key == "img") {
      this.insertImage()
      this.setState({
        editorFormat: {}
      })
    } else {
      this.editorCtx.format(item.key, item.value)
    }
    e.stopPropagation()
  }
  onStatusChange(e) {
    this.setState({
      editorFormat: e.detail
    })
  }
  async onEditorReady() {
    const that = this
    Taro.createSelectorQuery().select('#editor').context(function (res) {
      that.editorCtx = res.context
    }).exec()
  }



  async post(e) {
    let { title } = e.detail.value
    let contetns = await this.editorCtx.getContents()
    
    if(!this.state.logo) {
      Tips.failure('缺少封面图')
      return null
    }
    Tips.loading("提交中")
    this.setState({
      submited: true
    })
    let attachment = await this.props.dispatch({
      type: 'attachment/upload',
      payload: {
        filePath: this.state.logo,
      },
    })
    if (attachment) {
      let response = await this.props.dispatch({
        type: 'article/addArticle',
        payload: {
          content: contetns.html,
          app_id: this.state.appId,
          title: title,
          image: attachment.blob_id
        }
      })

      this.setState({
        submited: false
      })

      if(response) {
        Router.back()
      }
    } else {
      this.setState({
        submited: false
      })
    }
  }

  calNavigationBarAndStatusBar() {
    const systemInfo = Taro.getSystemInfoSync()
    const { statusBarHeight, platform } = systemInfo
    const isIOS = platform === 'ios'
    const navigationBarHeight = isIOS ? 44 : 48
    return statusBarHeight + navigationBarHeight
  }

  render() {
    let { formatlist, editorFormat, appId, isIOS, keyboardHeight, editorHeight,submited } = this.state;
    console.log(editorFormat)
    return (
      <Form onSubmit={this.post.bind(this)}>

        <View className='container' style={`height:${editorHeight}px;`}>
          <Button className="save-layout-btn" style={`bottom:${isIOS ? keyboardHeight : 0}px`} formType="submit" disabled={submited}>发布</Button>
          <View className="save-layout-logo-btn" style={`bottom:${isIOS ? keyboardHeight : 0}px`} onClick={this.saveImage.bind(this)}>封面图</View>
          <J2Input label="标题" placeholder="输入标题" name="title" />
          <Editor id="editor" showImgSize
            showImgResize
            showImgToolbar
            placeholder="写点什么？"
            onStatuschange={this.onStatusChange.bind(this)}
            onReady={this.onEditorReady.bind(this)}>
          </Editor>
          <View className="toolbar" style={`bottom:${isIOS ? keyboardHeight : 0}px`} >
            {
              formatlist.map((item, index) => {
                return (
                  <Text className={`iconfont editor-item ${item.style} ${editorFormat[item.key] == item.value ? 'ql-active' : ''}`} onClick={this.handleEditorFormat.bind(this, item)} ></Text>
                )
              })
            }
          </View>

        </View>        </Form>

    )
  }
}
export default NewArticle
