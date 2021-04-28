
import Taro, { Component, Config,useReachBottom } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import './article-detail.scss'
import { BaseProps } from '../../utils/base.interface'
import { Router } from '../../config/router'
import EntityUtils from '../../utils/entity_utils'
import { ParserRichText, J2Comments, CreateComment, Post } from '../../components'
import {ArticleModel} from '../../models/data/model'
import TimeHelper from '../../utils/time-helper'
import Action from '../../utils/action'
import EventCenter from '../../utils/event-center'
/**
 * articleDetail.state 参数类型
 *
 * @export
 * @interface ArticleDetailState
 */
export interface ArticleDetailState {
  articleId: string | null
  page: number
  replyTo: CreateComment.ReplyTo | null
  commentModal: boolean
}

/**
 * articleDetail.props 参数类型
 *
 * @export
 * @interface ArticleDetailProps
 */
export interface ArticleDetailProps extends BaseProps {
  articleId: string,
  entities?: object,
  isLast: boolean
}

@connect(({ articleDetail, entities, loading }) => ({
  ...articleDetail,
  entities: entities,
  loading: loading.models.articleDetail
}))

class ArticleDetail extends Component<ArticleDetailProps, ArticleDetailState> {
  constructor(props: ArticleDetailProps) {
    super(props)
    this.state = {
      articleId: null,
      page: 1,
      commentModal: false,
      replyTo: null
    }
  }

  onPullDownRefresh() {
    this.setState(
      {
        page: 1,
      },
      () => {
        this.getArticle(this.state.articleId)
        this.getComments(this.state.articleId)
      },
    )
  }


  onLikeArticle(item: any) {
    this.props.dispatch({
      type: 'articleDetail/likeArticle',
      payload: {
        id: item.id,
      },
    })
  }

  onUnlikeArticle(item: any) {
    this.props.dispatch({
      type: 'articleDetail/unlikeArticle',
      payload: {
        id: item.id,
      },
    })
  }

  getComments(commentableId: string| null) {
    this.props.dispatch({
      type: 'articleDetail/getComments',
      payload: {
        commentable_id: commentableId,
        commentable_type: "Article",
        page: this.state.page
      },
    })
  }

  onCloseModal() {
    console.log('onClose')
    this.setState({
      commentModal: false,
    })
  }

  async getArticle(articleId){
    await this.props.dispatch({
      type: 'articleDetail/getArticle',
      payload: {
        id: articleId,
      },
    })
  }

  componentWillMount() {
    let params = Router.getParams(this.$router.params)
    this.getArticle(params.articleId)
    this.setState({
      articleId: params.articleId
    },()=>{
      this.getComments(params.articleId)
    })
    Taro.eventCenter.on(EventCenter.DESTROY_ARTICLE,()=>{
      Router.back()
    })
  }

  componentWillUnmount(){
    Taro.eventCenter.off(EventCenter.DESTROY_ARTICLE)
  }
  onComment(replyTo: CreateComment.ReplyTo) {
    this.setState({
      commentModal: true,
      replyTo: replyTo
    })
  }
  

  onCommentArticle() {
    this.setState({
      commentModal: true,
      replyTo: null
    })
  }

  onReachBottom(){
  }

  onLikesLinkPress(e) {
    if ((e.type = 'linkpress')){
      console.log(e.detail)
    }
  }

  onFeatureBtnClick() {
    let item = EntityUtils.getArticle(this.props.entities, this.state.articleId)
    let items = Action.getArticleActions(item)
    Taro.showActionSheet({
      itemList: items.map((item) => item.value),
    })
      .then(res => {
        Action.sendArticleAction(items[res.tapIndex], this.props.dispatch,item.id)
        console.log(res.errMsg, res.tapIndex)
      })
      .catch(err => console.log(err.errMsg))
  }



  render() {
    const { entities,isLast } = this.props
    const { commentModal, replyTo, articleId } = this.state
    if (!this.props.articleId) return <View />

    let article = EntityUtils.getArticle(entities,articleId)
    useReachBottom(() => {
      if (!isLast) {
        this.setState(
          {
            page: this.state.page + 1,
          },
          () => {
            this.getComments(articleId)
          },
        )
      }
    })
    if(article) {
      Taro.setNavigationBarTitle({ title: article.title })
    }
    
    return (
      <View className='container'>
        <View className="article-detail">
          <Image mode="aspectFill" className="article-detail-image" src={article.image_url ? article.image_url : ""} />
          <View className="article-detail-title">{article.title}</View>
          <View className="article-detail-header">
            <View className="article-detail-header-author">{article.user.nick_name}</View>
            <View className="article-detail-header-time">{new TimeHelper().showRelativeTime(Number(article.created_at))}</View>
            <Text className="iconfont icon-arrow-down article-detail-header-btn" onClick={this.onFeatureBtnClick.bind(this)}/>
          </View>
          <View className="article-detail-content">
            {
              article.content &&
              <ParserRichText
              onLinkpress={this.onLikesLinkPress.bind(this)}
              html={article.content.replace(/wx:nodeid="\d+"/g,'')}
              selectable></ParserRichText>
            }

          </View>
          <View className="article-detail-feature">
            <View className="article-detail-feature">
              <View className="article-detail-feature-read-count">阅读 {article.hits}</View>
              <View className="article-detail-feature-like" onClick={article.liked ? this.onUnlikeArticle.bind(this, article) :
                this.onLikeArticle.bind(this, article)}>
                <Text
                  className={`iconfont ${article.liked ? "icon-good-fill" : "icon-good"} article-detail-feature-like-icon`}></Text>
                <Text className="text">{article.likes_count}</Text>
              </View>
            </View>
          </View>
          {
            article.comments && 
            <J2Comments
              modelNamespace="articleDetail"
              comments={article.comments} commentsCount={article.comments_count}
              commentable_id={article.id} entities={entities} commentable_type="Article"
              dispatch={this.props.dispatch} onComment={this.onComment.bind(this)}></J2Comments>
          }

          <View className="create-post-layout">
            {
              commentModal && 
              <CreateComment
              dispatch={this.props.dispatch}
              modelNamespace="articleDetail"
              commentableType="Article"
              isShowing={commentModal}
              commentableId={article.id}
              commentableNickName={article.user.nick_name}
              replyTo={replyTo}
              onClose={this.onCloseModal.bind(this)}
            />
            }

          </View>

          <View className="reply" onClick={this.onCommentArticle.bind(this)}>
            <View className="reply-btn">点赞太容易，评论显真情</View>
          </View>
        </View>
      </View>
    )
  }
}
export default ArticleDetail
