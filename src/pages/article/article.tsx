
import Taro, { Component, Config, useReachBottom } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import Api from '../../utils/request'
import './article.scss'
import { BaseProps, BaseStates } from '../../utils/base.interface'
import EntityUtils from '../../utils/entity_utils'
import TimeHelper from '../../utils/time-helper'
import { Router } from '../../config/router'
import { J2GroupTab } from '../../components'
import { globalData } from '../../utils/common'
import EventCenter from '../../utils/event-center'
/**
 * article.state 参数类型
 *
 * @export
 * @interface ArticleState
 */
export interface ArticleState extends BaseStates {
  page: number
}

/**
 * article.props 参数类型
 *
 * @export
 * @interface ArticleProps
 */
export interface ArticleProps extends BaseProps {
  articleIds: Array<number>
  isLast: boolean,
  entities?: object
}

@connect(({ article, entities, loading }) => ({
  ...article,
  entities: entities,
  loading: loading.models.article
}))

class Article extends Component<ArticleProps, ArticleState> {
  config: Config = {
    navigationBarTitleText: '文章'
  }
  constructor(props: ArticleProps) {
    super(props)
    this.state = {
      page: 1,
      appId: null
    }
  }

  componentWillUnmount(){
    Taro.eventCenter.off(EventCenter.DESTROY_ARTICLE)
    Taro.eventCenter.off(EventCenter.ADD_ARTICLE_SUCCESS)
  }
  componentWillMount() {
    let params = Router.getParams(this.$router.params)
    this.setState({
      appId: params.appId
    }, () => {
      this.getArticles()
    })
    Taro.eventCenter.on(EventCenter.DESTROY_ARTICLE,()=>{
      this.onPullDownRefresh()
    })
    Taro.eventCenter.on(EventCenter.ADD_ARTICLE_SUCCESS,()=>{
      this.onPullDownRefresh()
    })


  }

  onPullDownRefresh() {
    this.setState(
      {
        page: 1,
      },
      () => {
        this.getArticles()
      },
    )
  }

  async getArticles() {
    await this.props.dispatch({
      type: 'article/getArticles',
      payload: {
        page: this.state.page,
        app_id: this.state.appId
      },
    })
  }


  onNavgateToArticleDetail(article, e) {
    Router.navigateTo(Router.ARTICLE_DETAIL, {
      articleId: article.id,
      appId: this.state.appId
    })
  }

  onNavgateToNewArticle(article, e) {
    Router.navigateTo(Router.NEW_ARTICLE, {
      articleId: article.id,
      appId: this.state.appId
    })
  }


  render() {
    const { articleIds, isLast, loading, entities } = this.props
    const { appId } = this.state
    let app = EntityUtils.getApp(entities, appId)
    useReachBottom(() => {
      if (!isLast) {
        this.setState(
          {
            page: this.state.page + 1,
          },
          () => {
            this.getArticles()
          },
        )
      }
    })
    let articles = EntityUtils.getArticles(entities, articleIds)
    return (
      <View className='container'>
        {
          (app && app.own.id == globalData.userInfo.id) && (
            <View className="article-list-item-new" onClick={this.onNavgateToNewArticle.bind(this)}>
              <Text className="iconfont icon-add-select add" />
            </View>
          )
        }

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
export default Article
