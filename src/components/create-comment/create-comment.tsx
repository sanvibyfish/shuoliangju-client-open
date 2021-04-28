/** @format */

import Taro, { Component } from '@tarojs/taro'
import { View, Textarea, Text, Image, Form, Button } from '@tarojs/components'
import './create-comment.scss'
import Permissions from '../../utils/permissions'
import { BaseProps, BaseStates } from '../../utils/base.interface'
import Tips from '../../utils/tips'


declare namespace CreateComment {
  interface ReplyTo {
    id: string
    user_id: string
    user_nick_name: string
  }


  /**
   * createComment.state 参数类型
   *
   * @export
   * @interface CreateCommentState
   */
  interface IState {
    image?: string | null
    body: string | null,
    isShowText: boolean,
    onFacus: boolean,
    submited: boolean
    keyboradHeight: number
  }

  /**
   * createComment.props 参数类型
   *
   * @export
   * @interface IProps
   */
  interface IProps extends BaseProps {
    onClose(): any
    commentableId: number | null
    commentableNickName: string
    isShowing: boolean
    replyTo: CreateComment.ReplyTo | null,
    modelNamespace: string
    commentableType: string
  }
}

class CreateComment extends Component<CreateComment.IProps, CreateComment.IState> {
  constructor(props: CreateComment.IProps) {
    super(props)
    this.state = {
      body: '',
      isShowText: false,
      onFacus: false,
      submited: false
    }
  }
  static options = {
    addGlobalClass: true,
  }
  // static defaultProps: CreateCommentProps = {
  //   onSend: () => { },
  //   onClose: () => { }
  // }



  chooseImage() {
    let self = this
    Permissions.openPhotosAlbum()
      .then(res => {
        Taro.chooseImage({ count: 1 }).then(res => {
          if (res.tempFilePaths) {
            self.setState({
              image: res.tempFilePaths[0],
            })
          }
        })
      })
      .catch(err => {
        console.log(err)
      })
  }

  onFocus(e) {
    let keyboradHeight = e.detail.height;
    this.setState({
      keyboradHeight
    })
  }

  async onSubmit(e) {
    let blob_id
    const { body } = e.detail.value
    Tips.loading("提交中")
    this.setState({
      submited: true
    })
    if (this.state.image) {
      let attachment = await this.props.dispatch({
        type: 'attachment/upload',
        payload: {
          filePath: this.state.image,
        },
      })
      if (!attachment) {
        this.setState({
          submited: false
        })
        return null
      } else {
        blob_id = attachment.blob_id
      }
    }

    let response = await this.props.dispatch({
      type: `${this.props.modelNamespace ? this.props.modelNamespace : "home"}/addComment`,
      payload: {
        body: body ? body : this.state.body,
        commentable_id: this.props.commentableId,
        image: blob_id,
        reply_to_id: this.props.replyTo ? this.props.replyTo.id : null,
        commentable_type: this.props.commentableType
      },
    })
    Tips.loaded()
    if (response) {
      this.setState({
        image: null,
        body: null,
        submited: false
      }, () => {
        this.props.onClose()
      })
    } else {
      this.setState({
        submited: false
      })
    }
  }
  onShowTextare() {       //显示textare
    this.setState({
      isShowText: false,
      onFacus: true,
    })
  }

  onRemarkInput(event) {               //保存输入框填写内容
    var value = event.detail.value;
    this.setState({
      body: value,
      isShowText: true,
      onFacus: false,
      keyboradHeight: 0
    });
  }

  render() {
    if (!this.props.isShowing) return <View />
    const { commentableNickName, replyTo } = this.props
    const { isShowText, image, submited, keyboradHeight } = this.state
    let spaceingHeight = 150
    if (!isShowText && image) {
      spaceingHeight = spaceingHeight + 86;
    }
    return (
      <View className="create-comments">
        <View className="create-comments-mask" onClick={this.props.onClose.bind(this)}></View>
        <View className="create-comments-mask-content" style={`padding-bottom:${keyboradHeight}px;`}>
          <Form onSubmit={this.onSubmit.bind(this)}>
            <View className="create-comments-body" >
              <View className="reply-user-name">
                {
                  replyTo ? `回复 ${replyTo.user_nick_name}` : `评论 ${commentableNickName}`
                }
              </View>
              {
                !isShowText ? (
                  <Textarea
                    adjust-position={false}
                    onFocus={this.onFocus.bind(this)}
                    // cursor-spacing={spaceingHeight}
                    onBlur={this.onRemarkInput.bind(this)}
                    focus={this.state.onFacus}
                    className="create-comments-body-textarea"
                    placeholder="点赞太容易，评论显真情"
                    maxlength={-1}
                    value={this.state.body}
                    placeholderStyle="color:#acacac;"
                    name="body"
                  />) : (
                    <View style={this.state.body ? "color:#000;" : "color:#acacac;"} className="create-comments-body-textarea" onClick={this.onShowTextare.bind(this)}>
                      {this.state.body ? this.state.body : "点赞太容易，评论显真情"}
                    </View>
                  )
              }
              {this.state.image ? <Image className="create-comments-body-image" src={this.state.image} mode="scaleToFill"></Image> : <View />}
            </View>
            <View className="create-comments-feature">
              <Text className="iconfont icon-image-text create-comments-feature-text" onClick={this.chooseImage.bind(this)} />
              <Button className="create-comments-feature-btn-send" formType="submit" disabled={submited}>
                发送
              </Button>
            </View>
          </Form>
        </View>
      </View>
    )
  }
}

export default CreateComment
