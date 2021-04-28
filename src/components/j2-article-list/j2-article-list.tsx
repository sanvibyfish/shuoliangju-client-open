import Taro, { Component,useReachBottom } from '@tarojs/taro'
import { View,Image } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import './j2-article-list.scss'
import EntityUtils from '../../utils/entity_utils'
import TimeHelper from '../../utils/time-helper'
import { Router } from '../../config/router'
import { J2GroupTab } from '../../components'
import { globalData } from '../../utils/common'
import EventCenter from '../../utils/event-center'
import { BaseProps, BaseStates } from '../../utils/base.interface'


/**
 * j2-article-list.state 参数类型
 *
 * @export
 * @interface J2ArticleListState
 */
export interface J2ArticleListState {
  page: number
}

/**
 * j2-article-list.props 参数类型
 *
 * @export
 * @interface J2-article-listProps
 */
export interface J2ArticleListProps extends BaseProps{
  articleIds: Array<number>
  isLast: boolean
  appId: number | null
}
@connect(({ article, entities, loading }) => ({
  ...article,
  entities: entities,
  loading: loading.models.article
}))
class J2ArticleList extends Component<J2ArticleListProps,J2ArticleListState> {
  constructor(props: J2ArticleListProps) {
    super(props)
    this.state = {
      page: 1
    }
  }
  static options = {
    addGlobalClass: true
  }
  static defaultProps:J2ArticleListProps = {
    articleIds: [],
    isLast: false,
    entities: null
  }



  onNavgateToArticleDetail(article, e) {
    Router.navigateTo(Router.ARTICLE_DETAIL, {
      articleId: article.id,
      appId: this.props.appId
    })
  }

  render() {
    const { articleIds, isLast, entities } = this.props
    let articles = EntityUtils.getArticles(entities, articleIds)
    return (
      <View className='j2-article-lists'>
        <View className="article-list">
          {
            articleIds && articles.map((item) => {
              return (
                <View className="article-list-item" onClick={this.onNavgateToArticleDetail.bind(this, item)}>
                  <Image className="article-list-item-image" mode="aspectFill" src={item.image_url ? item.image_url : ""} />

                  <View className="article-list-item-content">
                    <View className="article-list-item-content-title">
                      {item.title}
                    </View>
                    <View className="article-list-item-content-feature">
                      <View className="article-list-item-content-feature-time">{new TimeHelper().showRelativeTime(Number(item.created_at))}</View>
                      <View className="article-list-item-content-feature-distance">·</View>
                      <View className="article-list-item-content-feature-read-count">{item.hits} 阅读</View>
                      <View className="article-list-item-content-feature-distance">·</View>
                      <View className="article-list-item-content-feature-like-count">{item.likes_count} 喜欢</View>
                      <View className="article-list-item-content-feature-distance">·</View>
                      <View className="article-list-item-content-feature-comment-count">{item.comments_count} 评论</View>
                    </View>
                  </View>
                </View>
              )
            })
          }
        </View>
      </View>
    )
  }
}

export default J2ArticleList
