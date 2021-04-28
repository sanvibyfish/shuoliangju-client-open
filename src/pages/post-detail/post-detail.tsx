/** @format */

import Taro, { Component, Config, useReachBottom, useShareAppMessage } from '@tarojs/taro'
import { View, Text, Image, Button, Canvas, ScrollView } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import './post-detail.scss'
import { BaseProps } from '../../utils/base.interface'
import { Router } from '../../config/router'
import { UserInfo, ParserRichText, CreateComment, Post, J2Comments, Poster } from '../../components'
import HtmlHelper from '../../utils/html-helper'
import TimeHelper from '../../utils/time-helper'
import wechatPng from '../../assets/images/wechat.png'
import imagePng from '../../assets/images/image.png'
import Action from '../../utils/action'
import EntityUtils from '../../utils/entity_utils'
import { PostModel } from '../../models/data/model'
import EventCenter from '../../utils/event-center'
import Tips from '../../utils/tips'
/**
 * post-detail.state 参数类型
 *
 * @export
 * @interface Post-detailState
 */
export interface PostDetailState {
  page: number
  commentModal: boolean
  replyTo: CreateComment.ReplyTo | null
  isShareImage: boolean
  shareConfig: any
  postId: number | null
}
/**
 * postDetail.props 参数类型
 *
 * @export
 * @interface PostDetailProps
 */
export interface PostDetailProps extends BaseProps {
  postId: PostModel
  entities: Array<any>
  isLast: boolean
}

@connect(({ postDetail, entities, loading }) => ({
  ...postDetail,
  entities: entities,
  loading: loading.models.postDetail,
}))
class PostDetail extends Component<PostDetailProps, PostDetailState> {
  config: Config = {
    navigationBarTitleText: '帖子详情',
  }
  constructor(props: PostDetailProps) {
    super(props)
    this.state = {
      page: 1,
      commentModal: false,
      replyTo: null,
      isShareImage: false,
      shareConfig: null,
      postId: null
    }
  }

  async draw() {
    let config = await this.genShareImageJson()
    console.log(config)
    this.setState({
      isShareImage: true,
      shareConfig: config,
    })
    Tips.loading('绘制中...')
  }
  static defaultProps: PostDetailProps = {
    // post: null,
    isLast: false,
  }

  onLikesLinkPress(e) {
    if ((e.type = 'linkpress') && e.detail.startsWith('like')) {
      let response = e.detail.split('$')
      let user_id = response[1]
      let user = EntityUtils.getUser(this.props.entities,user_id)
      Router.navigateTo(Router.USER_PROFILE, {
        userId: user.id,
        title: user.nick_name
      })
    }
  }

  async componentWillMount() {
    let params = Router.getParams(this.$router.params)
    let postEntity = await this.props.dispatch({
      type: 'postDetail/getPost',
      payload: {
        id: params.postId,
      },
    })
    let app = EntityUtils.getApp(this.props.entities, postEntity.app_id)
    if(!app) {
      this.props.dispatch({
        type: 'app/getApp',
        payload: {
          id: postEntity.app_id,
        },
      })
    }

    this.setState({
      postId: params.postId
    },() =>{
      this.getComments()
    })
    Taro.eventCenter.on(EventCenter.DESTROY_POST, (id) => {
      Router.back()
    })
 

  }

  componentWillUnmount() {
    Taro.eventCenter.off(EventCenter.DESTROY_POST)
  }

  async getPost() {
    this.props.dispatch({
      type: 'postDetail/getPost',
      payload: {
        id: this.state.postId,
      },
    })
  }

  onPullDownRefresh() {
    this.setState(
      {
        page: 1,
      },
      async () => {
        await this.getPost()
        this.getComments()
      },
    )
  }

  onLikePost(item: any) {
    this.props.dispatch({
      type: 'postDetail/likePost',
      payload: {
        id: item.id,
      },
    })
  }

  onUnlikePost(item: any) {
    this.props.dispatch({
      type: 'postDetail/unlikePost',
      payload: {
        id: item.id,
      },
    })
  }

  onStarPost(item: PostModel) {
    this.props.dispatch({
      type: 'postDetail/starPost',
      payload: {
        id: item.id,
      },
    })
  }

  onUnstarPost(item: PostModel) {
    this.props.dispatch({
      type: 'postDetail/unstarPost',
      payload: {
        id: item.id,
      },
    })
  }

  async getComments() {
    await this.props.dispatch({
      type: 'postDetail/getComments',
      payload: {
        page: this.state.page,
        commentable_id: this.state.postId,
        commentable_type: "Post"
      },
    })
  }


  previewImage(index, e) {
    e.stopPropagation()
    const {entities, postId} = this.props
    let postEntity =  EntityUtils.getPost(entities, postId)
    Taro.previewImage({
      urls: postEntity.images_url,
      current: postEntity.images_url[index],
    }).then(res => { })
  }

  onCloseModal() {
    this.setState({
      commentModal: false,
    })
  }

  commentPost() {
    let postEntity =  EntityUtils.getPost(this.props.entities, this.props.postId)
    let app = EntityUtils.getApp(this.props.entities, postEntity.app_id)
    if(app.abilities.join) {
      Taro.showModal({
        title: '提示',
        content: '你需要加入以后才能发布哦~',
        confirmText: '加入'
      })
      .then((res) => {
        if(res.confirm) {
          this.props.dispatch({
            type: 'app/joinApp',
            payload: {
              id: postEntity.app_id
            }
          })
        }
      } )
    } else {
      this.setState({
        commentModal: true,
        replyTo: null
      })
    }

  }

  onPostButtonClick() {
    let post = EntityUtils.getPost(this.props.entities, this.props.postId)
    let items = Action.getPostActions(post)
    Taro.showActionSheet({
      itemList: items.map((item) => item.value),
    })
      .then(res => {
        Action.sendAction(items[res.tapIndex], this.props.dispatch, post.id)
        console.log(res.errMsg, res.tapIndex)
      })
      .catch(err => console.log(err.errMsg))
  }
  componentDidMount() { }

  onShareAppMessage() {
    const {entities, postId} = this.props
    let postEntity =  EntityUtils.getPost(entities, postId)

    return {
      title: `来自${postEntity.user.nick_name}发布的帖子`,
    }
  }

  async genShareImageJson() {
    const { entities, postId} = this.props
    let postEntity = EntityUtils.getPost(entities, postId)
    let myQrcode = await this.props.dispatch({
      type: 'postDetail/qrcodePost',
      payload: {
        id: postEntity.id
      }
    })
    let systemInfo = await Taro.getSystemInfo()
    let destY = 750
    let innerDestHeight = 670
    let innerDestWidth = 670
    let y = 0
    let json = {
      preload: true,
      width: 750,
      height: 750,
      backgroundColor: '#fff',
      debug: false,
      pixelRatio: systemInfo.pixelRatio,
      blocks: [
        {
          x: 0,
          y: 0,
          width: 750,
          height: 750,
          paddingLeft: 0,
          paddingRight: 0,
          borderWidth: 0,
          backgroundColor: '#1F53E4',
          borderRadius: 0,
        },
        {
          x: 40,
          y: 40,
          width: 670,
          height: 670,
          paddingLeft: 0,
          paddingRight: 0,
          borderWidth: 0,
          backgroundColor: '#fff',
          borderRadius: 12,
        },
      ],
      texts: [],
      images: [],
      lines: [],
    }

    let avatarX = 56
    let avatarY = 56
    let avatarWidth = 160
    let avatarHeight = 160

    json.images.push({
      url: postEntity.user.avatar_url,
      width: avatarWidth,
      height: avatarHeight,
      y: avatarY,
      x: avatarX,
      borderRadius: 160,
      zIndex: 10,
      // borderRadius: 150,
      // borderWidth: 10,
      // borderColor: 'red',
    })

    y = avatarY + avatarHeight
    destY = y
    innerDestHeight = y

    let fontSize = 32
    let paddingLeft = 28
    let userNameX = avatarX + avatarWidth + paddingLeft
    let userNameY = avatarX + avatarHeight / 2 - fontSize / 2

    json.texts.push({
      x: userNameX,
      y: userNameY,
      text: postEntity.user.nick_name,
      fontSize: fontSize,
      color: '#000',
      opacity: 1,
      baseLine: 'middle',
      lineHeight: fontSize,
      lineNum: 1,
      textAlign: 'left',
      zIndex: 999,
    })

    let timeX = userNameX
    let timeY = userNameY + fontSize
    json.texts.push({
      x: timeX,
      y: timeY,
      text: new TimeHelper().showTimeString(postEntity.time),
      fontSize: fontSize,
      color: '#a8a8a8',
      opacity: 1,
      baseLine: 'middle',
      lineHeight: fontSize,
      lineNum: 1,
      textAlign: 'left',
      zIndex: 999,
    })

    // 字符分隔为数组
    var bodyX = avatarX
    let paddingTop = 28
    let paddingRight = 56
    fontSize = 28
    var bodyY = avatarX + avatarHeight + paddingTop
    var maxWidth = innerDestWidth / 2 - paddingRight * 2

    let ctx = Taro.createCanvasContext("tempId", this.$scope);
    postEntity.body.split('\n').map((item) => {
      if (ctx.measureText(item).width > maxWidth) {
        // 字符分隔为数组
        var arrText = item.split('');
        var line = '';
        for (var n = 0; n < arrText.length; n++) {
          var testLine = line + arrText[n];
          var metrics = ctx.measureText(testLine);
          var testWidth = metrics.width;
          if (testWidth > maxWidth && n > 0) {
            json.texts.push({
              x: bodyX,
              y: bodyY,
              text: line,
              fontSize: fontSize,
              color: '#000',
              opacity: 1,
              textAlign: 'left',
              lineHeight: fontSize,
              lineNum: 1,
              baseLine: 'top',
              zIndex: 999,
            })
            line = arrText[n];
            bodyY += fontSize
          } else {
            line = testLine;
          }
        }
        json.texts.push({
          x: bodyX,
          y: bodyY,
          text: line,
          fontSize: fontSize,
          color: '#000',
          opacity: 1,
          textAlign: 'left',
          lineHeight: fontSize,
          lineNum: 1,
          baseLine: 'top',
          zIndex: 999,
        })
        bodyY += fontSize;
      } else {
        json.texts.push({
          x: bodyX,
          y: bodyY,
          text: item,
          fontSize: fontSize,
          color: '#000',
          opacity: 1,
          textAlign: 'left',
          lineHeight: fontSize,
          lineNum: 1,
          baseLine: 'top',
          zIndex: 999,
        })
        bodyY += fontSize;
      }
    })

    y = bodyY
    destY = y
    innerDestHeight = y
    paddingTop = 28
    let imageY = bodyY + paddingTop
    let imageHeight = 720
    let imageWidth = innerDestWidth - 28

    if (postEntity.images_url) {
      postEntity.images_url.slice(0,2).map((images_url) => {
        json.images.push({
          url: `${images_url}`,
          width: imageWidth,
          height: imageHeight,
          y: imageY,
          x: avatarX,
          borderRadius: 5,
          zIndex: 10,
          // borderRadius: 150,
          // borderWidth: 10,
          // borderColor: 'red',
        })
        imageY += imageHeight + 16
      })
    }
    y = imageY
    destY = y
    innerDestHeight = y

    let qrcodeX = avatarX
    let qrcodeY = imageY + paddingTop
    let qrcodeWidth = 256
    let qrcodeHeight = 256
    paddingTop = 28
    json.images.push({
      url: myQrcode.url,
      width: qrcodeWidth,
      height: qrcodeHeight,
      y: qrcodeY,
      x: qrcodeX,
      borderRadius: 5,
      zIndex: 10,
      // borderRadius: 150,
      // borderWidth: 10,
      // borderColor: 'red',
    })

    fontSize = 36
    paddingLeft = 28
    let qrcodeTitleX = qrcodeWidth + avatarX + paddingLeft
    let qrcodeTitleY = qrcodeY + qrcodeHeight / 2 - fontSize / 2
    json.texts.push({
      x: qrcodeTitleX,
      y: qrcodeTitleY
      text: "长按识别小程序码",
      fontSize: fontSize,
      color: '#000',
      opacity: 1,
      baseLine: 'middle',
      lineHeight: 36,
      lineNum: 1,
      textAlign: 'left',
      zIndex: 999,
    })

    json.texts.push({
      x: qrcodeTitleX,
      y: qrcodeTitleY + fontSize
      text: "查看原文",
      fontSize: 28,
      color: '#a8a8a8',
      opacity: 1,
      baseLine: 'middle',
      lineHeight: 36,
      lineNum: 1,
      textAlign: 'left',
      zIndex: 999,
    })

    y = qrcodeY + qrcodeHeight
    destY = y + 40
    innerDestHeight = y - 40

    json.height = destY
    json.blocks[0].height = destY
    json.blocks[1].height = innerDestHeight
    return json
  }

  onCloseShareImage() {
    this.setState({
      isShareImage: false,
    })
  }

  onReachBottom(){
    console.log('onReachBottom')
  }

  onDisableMove(e: Event) {
    e.stopPropagation()
  }

  onComment(replyTo: CreateComment.ReplyTo) {

    let postEntity =  EntityUtils.getPost(this.props.entities, this.props.postId)
    let app = EntityUtils.getApp(this.props.entities, postEntity.app_id)
    if(app.abilities.join) {
      Taro.showModal({
        title: '提示',
        content: '你需要加入以后才能发布哦~',
        confirmText: '加入'
      })
      .then((res) => {
        if(res.confirm) {
          this.props.dispatch({
            type: 'app/joinApp',
            payload: {
              id: postEntity.app_id
            }
          })
        }
      } )
    } else {
      this.setState({
        commentModal: true,
        replyTo: replyTo
      })
    }

  }

  render() {
    const { entities, isLast, loading,postId } = this.props
    const { commentModal, replyTo, isShareImage, shareConfig } = this.state


    useReachBottom(() => {
      console.log('useReachBottom')
      if (!isLast) {
        this.setState(
          {
            page: this.state.page + 1,
          },
          () => {
            this.getComments()
          },
        )
      }
    })
    let postEntity = EntityUtils.getPost(entities, postId)
    if (!postEntity) return (<View />)
    let app = EntityUtils.getApp(entities,postEntity.app_id)

    return (
      <View className={`container`} >
        <View className={`post`}>
          {postEntity && (
            <View className="post-detail">
              <View className="user-info">
                <View className="user-info-user">
                  <UserInfo user={postEntity.user} created_at={postEntity.created_at} isOwn={app && app.own.id  == postEntity.user.id ? true : false} />
                </View>
                <Text className="iconfont icon-arrow-down user-info-btn" onClick={this.onPostButtonClick.bind(this)} />
              </View>
              <View className="body">
                <View className="content">{postEntity.body}</View>
                <View className="images">
                  {postEntity.thumbnails_url &&
                    postEntity.thumbnails_url.map((image, index) => {
                      return (
                        <Image
                          mode="aspectFill"
                          className="image"
                          src={image}
                          onClick={this.previewImage.bind(this, index)}
                        />
                      )
                    })}
                </View>
              </View>

              <View className="share-list">
                <Text className="share-list-label">分享到</Text>
                <View className="share-list-item">
                  <Button openType="share">
                    <Image src={wechatPng} className="share-list-item-icon"></Image>
                  </Button>
                  <Button onClick={this.draw.bind(this)}>
                    <Image src={imagePng} className="share-list-item-icon"></Image>
                  </Button>
                </View>
              </View>

              {postEntity.likes.length != 0 ? (
                <View className="likes-list">
                  <Text className="iconfont icon-favorites likes-list-icon"></Text>
                  <ParserRichText
                    html={HtmlHelper.getLikesHtml(postEntity.likes)}
                    onLinkpress={this.onLikesLinkPress.bind(this)}
                    selectable></ParserRichText>
                </View>
              ) : (
                  <View></View>
                )}

              <View className="feature">
                <View
                  className="feature-btn"
                  onClick={
                    postEntity.liked ? this.onUnlikePost.bind(this, postEntity) : this.onLikePost.bind(this, postEntity)
                  }>
                  <Text
                    className={`iconfont ${postEntity.liked ? 'icon-good-fill' : 'icon-good'} feature-btn-icon`}></Text>
                  <Text className="feature-btn-text">赞 </Text>
                </View>
                <View
                  className="feature-btn"
                  onClick={
                    postEntity.star ? this.onUnstarPost.bind(this, postEntity) : this.onStarPost.bind(this, postEntity)
                  }>
                  <Text
                    className={`iconfont ${
                      postEntity.star ? 'icon-favorites-fill' : 'icon-favorites'
                      } feature-btn-icon`}></Text>
                  <Text className="feature-btn-text">收藏</Text>
                </View>
              </View>
            </View>
          )}
          {
            postEntity.comments && 
            <J2Comments
            modelNamespace="postDetail"
            comments={postEntity.comments} commentsCount={postEntity.comments_count}
            commentable_id={postEntity.id} entities={entities}
            dispatch={this.props.dispatch} onComment={this.onComment.bind(this)}></J2Comments>
          }

        </View>
        <View className="create-post-layout">
          {
            commentModal && 
            <CreateComment
            dispatch={this.props.dispatch}
            modelNamespace="postDetail"
            commentableType="Post"
            isShowing={commentModal}
            commentableId={postEntity.id}
            commentableNickName={postEntity.user.nick_name}
            replyTo={replyTo}
            onClose={this.onCloseModal.bind(this)}
          />
          }
  
        </View>

        <View className="reply" onClick={this.commentPost.bind(this)}>
          <View className="reply-btn">点赞太容易，评论显真情</View>
        </View>
        {
          isShareImage && 
          <Poster onClose={this.onCloseShareImage.bind(this)} isShowing={isShareImage} config={shareConfig}></Poster>
        }
      </View>
    )
  }
}
export default PostDetail
