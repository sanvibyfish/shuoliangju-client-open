/** @format */

import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import './j2-posts.scss'
import { Post, CreateComment } from '../../components'
import { BaseProps } from '../../utils/base.interface'
import Tips from '../../utils/tips'
import { PostModel } from '../../models/data/model'
import EntityUtils from '../../utils/entity_utils'
import { connect } from '@tarojs/redux'

/**
 * j2Posts.state 参数类型
 *
 * @export
 * @interface J2PostsState
 */
export interface J2PostsState {
  commentModal: boolean
  replyTo: CreateComment.ReplyTo | null,
  currentItem: Model.Post | null
}

/**
 * j2Posts.props 参数类型
 *
 * @export
 * @interface J2PostsProps
 */
export interface J2PostsProps extends BaseProps {
  posts: Array<PostModel>
  appId: number | null
  entities: any
  appVisable: boolean
}

@connect(({ entities }) => ({
  entities: entities
}))
class J2Posts extends Component<J2PostsProps, J2PostsState> {
  constructor(props: J2PostsProps) {
    super(props)
    this.state = {
      commentModal: false,
      replyTo: null,
      currentItem: null
    }
  }
  static options = {
    addGlobalClass: true,
  }
  static defaultProps: J2PostsProps = {
    posts: [],
    appId: null,
    appVisable: false
  }

  commentPost(detail: Post.PostCommentDetail) {
    let  appId = this.props.appId
    if(!appId) {
      appId = detail.item.app.id
    }
    let app = EntityUtils.getApp(this.props.entities, appId)
    if(!app.abilities.join) {
      this.setState({
        commentModal: true,
        replyTo: detail.reply_to,
        currentItem: detail.item
      })
    } else {
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
                id: appId
              }
            })
          }
        } )
    }
 
  }



  onCloseModal() {
    this.setState({
      commentModal: false,
      replyTo: null,
      currentItem: null
    })
  }


  onDisableMove(e: Event) {
    e.stopPropagation()
  }




  render() {
    const { posts,appVisable } = this.props
    if (!posts) return <View />
    const { commentModal, replyTo, currentItem } = this.state
    return (
      <View className="j2-posts">
        {posts.map((item) => (
          <Post dispatch={this.props.dispatch} item={item} onComment={this.commentPost.bind(this)} key={item.id}  appVisable={appVisable}/>
        )
        )}
        <View className="j2-posts-comment-modal" onTouchMove={this.onDisableMove.bind(this)}>
          <CreateComment
            dispatch={this.props.dispatch}
            modelNamespace="home"
            commentableType="Post"
            isShowing={commentModal}
            commentableId={currentItem ? currentItem.id : null}
            commentableNickName={currentItem ? currentItem.user.nick_name : ''}
            replyTo={replyTo}
            onClose={this.onCloseModal.bind(this)}
          />
        </View>
        <View className="j2-posts-bottom">- THE END -</View>
      </View>
    )
  }
}

export default J2Posts
