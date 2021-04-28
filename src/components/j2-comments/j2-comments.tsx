import Taro, { Component,useReachBottom } from '@tarojs/taro'
import { View,Image,Button,Text } from '@tarojs/components'
import './j2-comments.scss'
import EntityUtils from '../../utils/entity_utils'
import { ParserRichText,Post, CreateComment } from '../../components'
import Action from '../../utils/action'
import HtmlHelper from '../../utils/html-helper'
import TimeHelper from '../../utils/time-helper'
import {Router} from '../../config/router'
/**
 * j2-comments.state 参数类型
 *
 * @export
 * @interface J2-commentsState
 */
export interface J2CommentsState {}

/**
 * j2Comments.props 参数类型
 *
 * @export
 * @interface J2CommentsProps
 */
export interface J2CommentsProps {
  modelNamespace: string
  commentsCount: number
  entities: object
  comments: Array<any>
  dispatch: any
  commentable_id: number
  commentable_type: string
  onComment(reply:CreateComment.ReplyTo): any
}


class J2Comments extends Component<J2CommentsProps,J2CommentsState > {
  constructor(props: J2CommentsProps) {
    super(props)
    this.state = {}
  }
  static options = {
    addGlobalClass: true
  }
  static defaultProps:J2CommentsProps = {}

  onLikeComment(item: any) {
    this.props.dispatch({
      type: `${this.props.modelNamespace}/likeComment`,
      payload: {
        id: item.id,
      },
    })
  }

  onUnlikeComment(item: any) {
    this.props.dispatch({
      type: `${this.props.modelNamespace}/unlikeComment`,
      payload: {
        id: item.id,
      },
    })
  }

  onFeature(comment: any, e) {
    let items = Action.getCommentActions(comment)
    if (items.length == 1 && items[0].key == "reply") {
      this.setState({
        commentModal: true,
        replyTo: {
          id: comment.id,
          user_id: comment.user.id,
          user_nick_name: comment.user.nick_name,
        },
      })
      return null
    }
    Taro.showActionSheet({
      itemList: items.map((item) => item.value),
    }).then(res => {
      let action = items[res.tapIndex]
      if (action.key == "reply") {
        this.commentPost({
          item: this.props.commentable_type == "Article" ?  EntityUtils.getArticle(this.props.entities, this.props.commentable_id) : EntityUtils.getPost(this.props.entities, this.props.commentable_id),
          reply_to: {
            id: comment.id,
            user_id: comment.user.id,
            user_nick_name: comment.user.nick_name,
          },
        })
      } else if (action.key = "destroy") {
        this.props.dispatch({
          type: `${this.props.modelNamespace}/deleteComment`,
          payload: {
            id: comment.id,
            commentable_id: comment.commentable_id,
            commentable_type: this.props.commentable_type
          },
        })
      }
      console.log(res.errMsg, res.tapIndex)
    })
      .catch(err => console.log(err.errMsg))
  }

  replyComment(comment, e) {
    console.log(comment)
    this.props.onComment({
      id: comment.id,
      user_id: comment.user.id,
      user_nick_name: comment.user.nick_name,
    })
  }

  commentPost(detail: Post.PostCommentDetail) {
    this.props.onComment(detail.reply_to)
  }


  onCommentLinkPress(e) {
    e.stopPropagation()
    if ((e.type = 'linkpress')) {
      if (e.detail.startsWith('img')) {
        let url = e.detail.split('$')[1]
        let urls = [url]
        Taro.previewImage({ urls: urls, current: urls[0] }).then(res => { })
      } else if (e.detail.startsWith('comment-user')) {
        let response = e.detail.split('$')
        let userId = response[1]
        Router.navigateTo(Router.USER_PROFILE, {
          userId: userId
        })
      } else if (e.detail.startsWith('comment')) {
        let response = e.detail.split('$')
        let comment = EntityUtils.getComment(this.props.entities,response[1])
        console.log(response[1])
        let items = Action.getCommentActions(comment)
        if (items.length == 1 && items[0].key == "reply") {
          this.commentPost({
            item: EntityUtils.getPost(this.props.entities, this.props.commentable_id),
            reply_to: {
              id: response[1],
              user_id: response[2],
              user_nick_name: response[3],
            },
          })
          return null
        }

        Taro.showActionSheet({
          itemList: items.map((item) => item.value),
        }).then(res => {
          let action = items[res.tapIndex]
          if (action.key == "reply") {
            this.commentPost({
              item: EntityUtils.getPost(this.props.entities, this.props.commentable_id),
              reply_to: {
                id: response[1],
                user_id: response[2],
                user_nick_name: response[3],
              },
            })
          } else if (action.key = "destroy") {
            this.props.dispatch({
              type: `${this.props.modelNamespace}/deleteComment`,
              payload: {
                id: comment.id,
                commentable_id: comment.commentable_id
              },
            })
          }
          console.log(res.errMsg, res.tapIndex)
        })
          .catch(err => console.log(err.errMsg))
      }
      // e.detail.ignore(); // 此链接不进行自动跳转/复制
    }
  }



  previewCommentImage(image_url, e) {
    e.stopPropagation()
    let images_url = [image_url]
    Taro.previewImage({
      urls: images_url,
      current: images_url[0],
    }).then(res => { })
  }

  render() {
    const {commentsCount,comments} = this.props
    return (
      <View className='comments'>
        <View className="comments-count">全部评论({commentsCount})</View>
        <View className="comments-list">
              {comments && comments.map((item, index) => {
                  return (
                    <View className="comments-comment">
                      <Image className="comments-comment-avatar" mode="aspectFill" src={item.user.avatar_url}></Image>
                      <View className="comments-comment-user">
                        <View className="comments-comment-user-name">{item.user.nick_name}</View>
                        <View className="comments-comment-user-content" onClick={this.onFeature.bind(this, item)}>
                          {item.body}
                          {item.image_url && (
                            <View>
                              <Image
                                onClick={this.previewCommentImage.bind(this, item.image_url)}
                                className="comments-comment-user-content-image"
                                src={item.image_url}
                                mode="aspectFill"
                              />
                            </View>
                          )}
                        </View>
                        {item.children && item.children.length != 0 && (
                          <View className="comments-comment-user-replies">
                            <ParserRichText
                              html={HtmlHelper.getDetailCommentsHtml(item.children)}
                              onLinkpress={this.onCommentLinkPress.bind(this)}
                              selectable></ParserRichText>
                          </View>
                        )}
                        <View className="comments-comment-user-bottom">
                          <View className="comments-comment-user-bottom-time">
                            {new TimeHelper().showRelativeTime(Number(item.created_at))}
                          </View>
                          <View className="comments-comment-user-bottom-feature">
                            <Button openType="share">
                              <Text className="iconfont icon-share comments-comment-user-bottom-feature-item"></Text>
                            </Button>
                            <Text
                              className="iconfont icon-comments comments-comment-user-bottom-feature-item"
                              onClick={this.replyComment.bind(this, item)}></Text>
                            <Text
                              className={`iconfont icon-good${
                                item.liked ? '-fill' : ''
                                } comments-comment-user-bottom-feature-item`}
                              onClick={
                                item.liked ? this.onUnlikeComment.bind(this, item) : this.onLikeComment.bind(this, item)
                              }>
                              {item.likes_count == 0 ? '' : item.likes_count}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  )
                })}
            </View>
            <View className="comments-bottom">- THE END -</View>
      </View>
    )
  }
}

export default J2Comments
