/** @format */

import Taro, { Component, Config, getSystemInfo, compressImage, useScope } from '@tarojs/taro'
import { View, Textarea, Text, Button, Form, Image, Canvas, Editor } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import './new-post.scss'
// import {  } from '../../components'
import * as Api from '../../services/attachment'
import Permissions from '../../utils/permissions'
import Tips from '../../utils/tips'
import { BaseProps, BaseStates } from '../../utils/base.interface'
import { Router } from '../../config/router'
import { J2ListItem } from '../../components'
import EntityUtils from '../../utils/entity_utils'

/**
 * newPost.state 参数类型
 *
 * @export
 * @interface NewPostState
 */
export interface NewPostState extends BaseStates {
  images: Array<string>
  sectionIds: Array<number>
  sectionId: number | null
  submited: boolean
}

/**
 * newPost.props 参数类型
 *
 * @export
 * @interface NewPostProps
 */
export interface NewPostProps extends BaseProps {
  entities: any
}

export interface Blob {
  byte_size: number
  checksum: string
  content_type: string
  filename: string
  signed_id: string
}

@connect(({ newPost, entities, loading }) => ({
  ...newPost,
  entities: entities,
  loading: loading.models.newPost,
}))
class NewPost extends Component<NewPostProps, NewPostState> {
  config: Config = {
    navigationBarTitleText: '创建帖子',
  }
  constructor(props: NewPostProps) {
    super(props)
    this.state = {
      images: [],
      sectionIds: [],
      sectionId: null,
      appId: null,
      submited: false
    }
  }

  componentWillMount() {
    let params = Router.getParams(this.$router.params)
    console.log(params.appId)
    this.setState({
      sectionIds: params.sectionIds,
      appId: params.appId,
      sectionId: params.sectionId
    })
  }

  componentDidMount() { }

  componentDidShow() {
  }

  async choooseImage() {
    const count = 9 - this.state.images.length
    Taro.chooseImage({ count: count }).then(res => {
      if (res.tempFilePaths) {
        this.setState({
          images: this.state.images.concat(res.tempFilePaths),
        })
      }
    })
  }


  previewImage(index, e) {
    Taro.previewImage({ urls: this.state.images, current: this.state.images[index] }).then(res => { })
  }

  removeImage(index, e) {
    let images = this.state.images
    images.splice(index, 1)
    this.setState({
      images: images,
    })
  }

  async post(e) {
    let { body } = e.detail.value
    let count = 0
    this.setState({
      submited: true
    })
    Tips.loading('提交中')
    let blob_ids
    if (this.state.images) {
      let uploadImages = await Promise.all(this.state.images.map(async (image, index) => {
        let compressRes = await Taro.compressImage({
          src: image, // 图片路径
          quality: 80 // 压缩质量
        })
        console.log(compressRes.tempFilePath)
        return compressRes.tempFilePath
      }))
      console.log(uploadImages)
      blob_ids = await this.props.dispatch({
        type: 'attachment/multiUpload',
        payload: {
          filePaths: uploadImages
        },
      })
    }
    if (!blob_ids) {
      this.setState({
        submited: false
      },()=>{
        Tips.loaded()
      })
    } else {
      let response = await this.props.dispatch({
        type: 'newPost/addPost',
        payload: {
          body: body,
          images: blob_ids,
          section_id: this.state.sectionId,
          app_id: this.state.appId
        }
      })

      this.setState({
        submited: false
      }, () => {
        if (response) {
          Tips.loaded()
          Router.back()
        }
      })
    }
  }

  onSectionClick() {
    Router.navigateTo(Router.CHOOSE_SECTIONS, {
      sectionId: this.state.sectionId,
      appId: this.state.appId
    })
  }


  render() {
    const { loading, entities } = this.props
    const { sectionIds, sectionId, submited } = this.state
    return (
      <View className="container">
        <View className="form">
          <Form onSubmit={this.post.bind(this)}>
            <View className="new-post-input">
              <Textarea name="body" placeholder="说点什么" className="post-input" maxlength="-1" />
            </View>
            <View className="images">
              {this.state.images &&
                this.state.images.map((image, index) => {
                  return (
                    <View className="image">
                      <View className="btn-layout" onClick={this.removeImage.bind(this, index)}>
                        <View className="remove">
                          <Text className="iconfont icon-close remove-btn" />
                        </View>
                      </View>
                      <Image mode="aspectFill" src={image} onClick={this.previewImage.bind(this, index)} />
                    </View>
                  )
                })}
              {this.state.images.length < 9 ? (
                <View className="add-layout image" onClick={this.choooseImage.bind(this)}>
                  <Text className="iconfont icon-add-select add" />
                </View>
              ) : (
                  ''
                )}
            </View>
            {
              (sectionIds && sectionIds.length > 0) && (
                <View className="features">
                  <J2ListItem
                    textColor="#999898"
                    label="选择话题"
                    onClick={this.onSectionClick.bind(this)}
                    value={sectionId && EntityUtils.getSection(entities, sectionId).name}
                  />
                </View>
              )
            }

            <Button className="btn post-btn" formType="submit" disabled={submited}>
              发布
            </Button>
          </Form>
        </View>
      </View>
    )
  }
}
export default NewPost
