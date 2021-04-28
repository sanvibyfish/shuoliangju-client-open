/** @format */

import Taro, { Component, useShareAppMessage } from '@tarojs/taro'
import './post.scss'
import { View, Text, Image, Button } from '@tarojs/components'
import { Router } from '../../config/router'
import PropTypes from 'prop-types'
import UserInfo from '../userInfo/userInfo'
import ParserRichText from '../ParserRichText/parserRichText'
import HtmlHelper from '../../utils/html-helper'
import { BaseProps } from '../../utils/base.interface'
import Model from 'src/utils/model'
import { globalData } from '../../utils/common'
import { deleteComment } from 'src/services/comment'
import share from '../../utils/share'
import Tips from '../../utils/tips'
import Action from '../../utils/action'
import { connect } from '@tarojs/redux'
import { denormalize } from 'normalizr'
import { comment, user, section } from '../../models/schema'
import { CreateComment } from '..'
import EntityUtils from '../../utils/entity_utils'
/**
 * post.state 参数类型
 *
 * @export
 * @interface PostState
 */
export interface PostState {
  commentViewShowing: boolean
  isOpenFullPost: boolean
}

/**
 * post.props 参数类型
 *
 * @export
 * @interface PostProps
 */

export interface PostProps extends BaseProps {
  item: any
  onComment(detail: Post.PostCommentDetail): void
  entities: any
  appVisable: boolean
}

declare namespace Post {
  interface PostCommentDetail {
    reply_to: CreateComment.ReplyTo | null
    item: Model.Post
  }

}

@connect(({ entities }) => ({
  entities: entities
}))
class Post extends Component<PostProps, PostState> {
  constructor(props: PostProps) {
    super(props)
    this.state = {
      commentViewShowing: false,
      isOpenFullPost: false
    }
  }
  static options = {
    addGlobalClass: true,
    item: PropTypes.object,
  }

  previewImage(index, e) {
    e.stopPropagation()
    const { item } = this.props
    Taro.previewImage({
      urls: item.images_url,
      current: item.images_url[index],
    }).then(res => { })
  }


  onPreviewImageForUrl(url) {
    let urls = [...url]
    Taro.previewImage({ urls: urls, current: urls[0] }).then(res => { })
  }

  onTest(e) {
    e.stopPropagation()
  }

  onStop(e) {
    e.stopPropagation()
  }

  onLike() {
    this.props.dispatch({
      type: 'post/likePost',
      payload: {
        id: this.props.item.id,
      },
    })
  }

  onUnlike() {
    this.props.dispatch({
      type: 'post/unlikePost',
      payload: {
        id: this.props.item.id,
      },
    })
  }

  getCommentEntity(id: string) {
    return denormalize(id, comment, this.props.entities)
  }

  getUserEntity(id: string) {
    return denormalize(id, user, this.props.entities)
  }

  onCommentLinkPress(e) {
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
        let comment = this.getCommentEntity(response[1])
        let items = Action.getCommentActions(comment)

        if (items.length == 1 && items[0].key == "reply") {
          this.props.onComment({
            item: this.props.item,
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
        })
          .then(res => {
            let action = items[res.tapIndex]
            if (action.key == "reply") {
              this.props.onComment({
                item: this.props.item,
                reply_to: {
                  id: response[1],
                  user_id: response[2],
                  user_nick_name: response[3],
                },
              })
            } else if (action.key = "destroy") {
              this.props.dispatch({
                type: 'home/deleteComment',
                payload: {
                  id: comment.id,
                  commentable_id: comment.commentable_id,
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

  onLikesLinkPress(e) {
    if ((e.type = 'linkpress') && e.detail.startsWith('like')) {
      let response = e.detail.split('$')
      let user_id = response[1]
      let user = this.getUserEntity(user_id)
      Router.navigateTo(Router.USER_PROFILE, {
        userId: user.id,
        title: user.nick_name
      })
    }
  }

  onPostButtonClick() {
    let items = Action.getPostActions(this.props.item)
    Taro.showActionSheet({
      itemList: items.map((item) => item.value),
    })
      .then(res => {
        Action.sendAction(items[res.tapIndex], this.props.dispatch, this.props.item.id)
        console.log(res.errMsg, res.tapIndex)
      })
      .catch(err => console.log(err.errMsg))
  }

  onNavgateToPostDetail(post, e) {
    Router.navigateTo(Router.POST_DETAIL, {
      postId: post.id,
    })
  }


  handlerNavgatePosts(section: any) {
    console.log('section app_id', section)
    Router.navigateTo(Router.SECTION_DETAIL, {
      sectionId: section.id,
      appId: section.app_id
    })
  }

  onOpenFullPost(e) {
    e.stopPropagation()
    this.setState({
      isOpenFullPost: !this.state.isOpenFullPost
    })
  }

  onCommentButtonClick(detail, e) {
    this.props.onComment({
      item: detail.item,
      reply_to: null
    })
  }


  onNavgateToHome(appId) {
    Router.navigateTo(Router.HOME, {
      appId: appId
    })
  }


  render() {
    const { item, entities, appVisable } = this.props
    const { isOpenFullPost } = this.state
    if (!item) return <View />
    let comments = item.comments.flatMap((value, index, array) => { return [...value.children, value] }).sort((a, b) => {
      return b.created_at - a.created_at
    })
    const app = EntityUtils.getApp(entities, item.app_id)
    return (
      <View className={`post ${appVisable ? 'post-discover' : ''}`}>
        <View className="user-info">
          <View className="user-info-user">
            <UserInfo user={item.user} created_at={item.created_at} isOwn={app && app.own.id == item.user.id ? true : false} isGrade={item.grade == "excellent" ? true : false} />
          </View>
          <Text className="iconfont icon-arrow-down user-info-btn" onClick={this.onPostButtonClick.bind(this)} />
        </View>

        <View className="body" onClick={this.onNavgateToPostDetail.bind(this, item)}>
          <View className="content">
            {
              item.body.length < 500 ?
                item.body
                :
                <View>{!isOpenFullPost ? `${item.body.substring(0, 500)}...` : item.body}<Text className="content-full-post-btn" onClick={this.onOpenFullPost.bind(this)}>{isOpenFullPost ? "收起全文" : "展开全文"}</Text></View>
            }
          </View>
          {item.thumbnails_url && item.thumbnails_url.length > 0 && (
            <View className={`images`}>
              {item.thumbnails_url.map((image, index) => {
                return (
                  <Image
                    mode="aspectFill"
                    className={`image  ${appVisable ? "discover-image" : ""}`}
                    src={image}
                    onClick={this.previewImage.bind(this, index)}
                  />
                )
              })}
            </View>
          )}
        </View>
        {
          item.section && (
            <View className="section">
              <View className="section-detail" onClick={this.handlerNavgatePosts.bind(this, item.section)}>
                <View className="section-detail-text"># {item.section.name}</View>
              </View>
            </View>
          )
        }
        <View className="feature">
          {
            appVisable && (
              <View className="feature-item feature-app" onClick={this.onNavgateToHome.bind(this, item.app_id)}>
                {item.app_name}
              </View>
            )
          }

          <View className="feature-item feature-comment" onClick={this.onCommentButtonClick.bind(this, { item: item })}>
            <Text className="iconfont icon-comments icon-item"></Text>
            <Text className="text">评论</Text>
          </View>

          <View className="feature-item feature-like">
            <Text
              className={`iconfont ${item.liked ? 'icon-good-fill ' : 'icon-good'} icon-item`}
              onClick={item.liked ? this.onUnlike.bind(this) : this.onLike.bind(this)}></Text>
            <Text className="text">{item.likes_count ? item.likes_count : ''}</Text>
          </View>
        </View>
        {((item.likes && item.likes.length > 0) || (item.comments && item.comments.length > 0)) && (
          <View className="info">
            {item.likes.length != 0 && (
              <View className={`likes-list`}>
                <Text className="iconfont icon-favorites likes-list-icon"></Text>
                <ParserRichText
                  html={HtmlHelper.getLikesHtml(item.likes)}
                  onLinkpress={this.onLikesLinkPress.bind(this)}
                  selectable></ParserRichText>
              </View>
            )}
            {(comments && comments.length != 0) && (
              <View className="comments-list">
                <View className="comment">
                  <ParserRichText
                    html={HtmlHelper.getCommentsHtml(comments.length > 8 ? comments.slice(0, 8) : comments)}
                    onLinkpress={this.onCommentLinkPress.bind(this)}
                    selectable></ParserRichText>
                  {item.has_more_comments && (
                    <View className="comment-has-more" onClick={this.onNavgateToPostDetail.bind(this, item)}>
                      查看更多
                      <Text className="iconfont icon-arrow-right" />
                    </View>
                  )}
                </View>
              </View>
            )}
          </View>
        )}
      </View>
    )
  }
}

export default Post
