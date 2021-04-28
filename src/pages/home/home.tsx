/** @format */

import Taro, { Component, Config, useReachBottom } from '@tarojs/taro'
import { View, Text, ScrollView, Image } from '@tarojs/components'
import { connect } from '@tarojs/redux'
// import Api from '../../utils/request'
// import Tips from '../../utils/tips'
import './home.scss'
import { Post, Sections, CreateComment, J2Posts, J2TopList, J2GroupTab, J2ArticleList } from '../../components'
import { Router } from '../../config/router'
import { BaseProps, BaseStates } from '../../utils/base.interface'
import { PostModel } from '../../models/data/model'
import EntityUtils from '../../utils/entity_utils'
import EventCenter from '../../utils/event-center'
import { globalData } from '../../utils/common'
import NavBar from 'taro-navigationbar';

/**
 * index.state 参数类型
 * @interface IndexState
 */
interface HomeState extends BaseStates {
  page: number
  articlePage: number
  currentIndex: number
  tabList: Array<any>
  background: string
}

/**
 * index.props 参数类型
 *
 * @export
 * @interface IndexProps
 */
interface HomeProps extends BaseProps {
  posts: Array<PostModel>
  postIds: Array<number>
  sectionIds: Array<number>
  entities: object
  article: object
  topList: Array<Post>
  isLast: boolean
  articleIsLast: boolean
}

@connect(({ home, article, entities, loading }) => ({
  ...home,
  entities: entities,
  loading: loading.models.home,
  article: article
}))
class Home extends Component<HomeProps, HomeState> {
  config: Config = {
    navigationBarTitleText: '首页',
    enablePullDownRefresh: true,
    navigationStyle: "custom"

  }
  constructor(props: HomeProps) {
    super(props)
    this.state = {
      page: 1,
      currentIndex: 0,
      appId: null,
      articlePage: 1,
      background: 'rgba(0,0,0,0)',
      tabList: [
        {
          id: 1,
          title: '全部',
        },
        {
          id: 2,
          title: '精华',
        },
        {
          id: 3,
          title: '热门',
        },
        {
          id: 4,
          title: '文章',
        },
        {
          id: 5,
          title: '话题',
        }
      ]
    }
  }

  async getPosts() {
    let type = ""
    let payload = {
      page: this.state.page,
      app_id: this.state.appId
    }
    if (this.state.currentIndex < 3) {
      if (this.state.currentIndex == 1) {
        payload.type = 'excellent'
      } else if (this.state.currentIndex == 2) {
        payload.type = 'popular'
      }
      await this.props.dispatch({
        type: 'home/getPosts',
        payload: payload
      })
    } else if (this.state.currentIndex == 3) {
      this.getArticles()
    } else if (this.state.currentIndex == 4) {

    }
  }

  onPageScroll(e) {
    if (e.scrollTop == 0) {
      this.setState({ background: `rgba(0,0,0,0)` });
    } else {
      this.setState({ background: `#ffffff` });
    }

  }


  async getTopPosts() {
    await this.props.dispatch({
      type: 'home/getTopPosts',
      payload: {
        page: this.state.page,
        app_id: this.state.appId,
        type: "top",
      },
    })
  }

  async getSections() {
    await this.props.dispatch({
      type: 'home/getSections',
      payload: {
        app_id: this.state.appId
      }
    })
  }

  async getApp() {
    await this.props.dispatch({
      type: 'home/getApp',
      payload: {
        id: this.state.appId
      }
    })
  }

  onJoinApp() {
    this.props.dispatch({
      type: 'home/joinApp',
      payload: {
        id: this.state.appId
      }
    })
  }

  onPullDownRefresh() {
    this.setState(
      {
        page: 1,
        articlePage: 1
      },
      () => {
        this.getPosts()
        this.getArticles()
      },
    )
    this.getSections()
    this.getApp()
    this.getTopPosts()
  }

  onShareAppMessage() {
    const { entities } = this.props
    const { appId } = this.state
    let app = EntityUtils.getApp(entities, appId)

    return {
      title: `${app.name}`,
    }
  }

  componentWillUnmount() {
    Taro.eventCenter.off(EventCenter.LOGIN_SUCCESS)
    Taro.eventCenter.off(EventCenter.TOP_POST)
    Taro.eventCenter.off(EventCenter.UNTOP_POST)
    Taro.eventCenter.off(EventCenter.ADD_NEW_POST)
    Taro.eventCenter.off(EventCenter.DESTROY_POST)
    Taro.eventCenter.off(EventCenter.EXCELLENT_POST_EVENT)
    Taro.eventCenter.off(EventCenter.UNEXCELLENT_POST_EVENT)
    Taro.eventCenter.off(EventCenter.DESTROY_ARTICLE)
    Taro.eventCenter.off(EventCenter.ADD_ARTICLE_SUCCESS)
  }

  componentWillMount() {
    let params = Router.getParams(this.$router.params)
    this.setState({
      appId: params.appId
    }, () => {
      this.getPosts()
      this.getSections()
      this.getTopPosts()
      this.getApp()
    })

    Taro.eventCenter.on(EventCenter.DESTROY_ARTICLE, () => {
      this.setState({
        articlePage: 1
      }, () => {
        this.getArticles()
      })
    })
    Taro.eventCenter.on(EventCenter.ADD_ARTICLE_SUCCESS, () => {
      this.setState({
        articlePage: 1
      }, () => {
        this.getArticles()
      })
    })


    Taro.eventCenter.on(EventCenter.LOGIN_SUCCESS, () => {
      this.onPullDownRefresh()
    })

    Taro.eventCenter.on(EventCenter.TOP_POST, () => {
      this.getTopPosts()
    })
    Taro.eventCenter.on(EventCenter.UNTOP_POST, () => {
      this.getTopPosts()
    })
    Taro.eventCenter.on(EventCenter.ADD_NEW_POST, () => {
      console.log("home appid", this.state.appId)
      this.onPullDownRefresh()
    })
    Taro.eventCenter.on(EventCenter.DESTROY_POST, (id) => {
      this.props.dispatch({
        type: 'home/actionDestroyPost',
        payload: {
          postId: id
        },
      })
    })

    Taro.eventCenter.on(EventCenter.EXCELLENT_POST_EVENT, () => {
      if (this.state.currentIndex == 1) {
        this.setState(
          {
            page: 1,
          },
          () => {
            this.getPosts()
          },
        )
      }
    })
    Taro.eventCenter.on(EventCenter.UNEXCELLENT_POST_EVENT, () => {
      if (this.state.currentIndex == 1) {
        this.setState(
          {
            page: 1,
          },
          () => {
            this.getPosts()
          },
        )
      }
    })
  }


  async getArticles() {
    await this.props.dispatch({
      type: 'article/getArticles',
      payload: {
        page: this.state.articlePage,
        app_id: this.state.appId
      },
    })
  }



  componentDidMount() {

  }


  onNavgateToNewArticle(e) {
    Router.navigateTo(Router.NEW_ARTICLE, {
      appId: this.state.appId
    })
  }


  handleNavgateNewPost() {
    Router.navigateTo(Router.NEW_POST, {
      appId: this.state.appId,
      sectionIds: this.props.sectionIds
    })
  }

  onNewButtonClick(e) {
    let itemList = ['图文发布']
    const app = EntityUtils.getApp(this.props.entities, this.state.appId)
    if (app && app.own.id == globalData.userInfo.id) {
      itemList = [...itemList, '文章发布']
    }

    if (itemList.length == 1) {
      this.handleNavgateNewPost()
    } else {
      Taro.showActionSheet({
        itemList: itemList
      })
        .then(res => {
          if (res.tapIndex == 0) {
            this.handleNavgateNewPost()
          } else if (res.tapIndex == 1) {
            this.onNavgateToNewArticle(e)
          }
        })
        .catch(err => console.log(err.errMsg))
    }

  }

  changeNavState(v) {
    this.setState(
      {
        currentIndex: v,
        page: 1,
      },
      () => {
        this.getPosts()
      },
    )
  }

  handlerGobackClick() {
    if (Router.canBack()) {
      Router.back()
    } else {
      Taro.switchTab({
        url: '/pages/me/me'
      })
    }
  }

  featureHome() {
    Router.navigateTo(Router.FEATURE_HOME, {
      appId: this.state.appId
    })
  }

  render() {
    const { sectionIds, isLast, loading, topList, postIds, entities, article } = this.props
    const { appId, tabList } = this.state
    useReachBottom(() => {
      if (this.state.currentIndex == 3) {
        if (!article.isLast) {
          this.setState(
            {
              articlePage: this.state.articlePage + 1,
            },
            () => {
              this.getArticles()
            },
          )
        }
      } else {
        if (!isLast) {
          this.setState(
            {
              page: this.state.page + 1,
            },
            () => {
              this.getPosts()
            },
          )
        }
      }
    })

    let posts = EntityUtils.getPosts(entities, postIds)
    let sectionEntities = EntityUtils.getSections(entities, sectionIds)
    let topPosts = EntityUtils.getPosts(entities, topList)
    let appEntity = EntityUtils.getApp(entities, appId)

    const isNotEmpty = (posts && posts.length > 0)

    return (
      <View className="container">
        <View className='nav'>
          <NavBar
            background={this.state.background}
            title={this.state.background == "rgba(0,0,0,0)" ? "" : (appEntity ? appEntity.name : "")}
            color='#000'
            iconTheme='dark'
            back
            home
            onHome={this.handlerGobackClick}
            onBack={this.handlerGobackClick}
          />
        </View>

        {
          appEntity && (
            <View>
              <J2GroupTab dispatch={this.props.dispatch} currentTabIndex={1} posts={topPosts} app={appEntity} sections={sectionEntities} />
            </View>
          )
        }

        <View style="background-color:white;">
          <View className="posts-tabs">
            {tabList.map((item, index) => (
              <View className="posts-tabs-item" onClick={this.changeNavState.bind(this, index)} key={item.title}>
                <View className={`tab-title ${index === this.state.currentIndex ? 'tab-title-active' : ''}`}>
                  {item.title}
                </View>
                <View className={`tab-border ${index === this.state.currentIndex ? 'tab-border-active' : ''}`}></View>
              </View>
            ))}
          </View>
        </View>

        {
          this.state.currentIndex < 3 && (
            <View className="posts-content">
              <View className="posts-top">
                <J2TopList topList={topPosts} />
              </View>
              {
                isNotEmpty ? (
                  <View className={`posts ${appEntity.abilities.join ? "posts-padding" : ""}`}>
                    {posts && <J2Posts posts={posts} dispatch={this.props.dispatch} appId={appEntity ? appEntity.id : null} />}
                  </View>
                ) : (
                    <View className="empty-bg">
                      <Image src="https://shuoliangju-cn.oss-cn-qingdao.aliyuncs.com/production/config/undraw_post2_19cj.png" mode="aspectFit"></Image>
                      <View className="empty-bg-tips">还没有任何帖子~</View>
                    </View>
                  )
              }

            </View>
          )
        }

        {
          this.state.currentIndex == 3 && (
            <J2ArticleList dispatch={this.props.dispatch} appId={this.state.appId} />)
        }
        {
          this.state.currentIndex == 4 && (
            <Sections appId={appId} items={sectionEntities} />
          )
        }

        {
          (!appEntity.abilities.join && globalData.userInfo) ? (
            <View className="add-btn" onClick={this.onNewButtonClick.bind(this)}>
              <Text className="iconfont icon-add-select add" />
            </View>
          ) : (
              <View className="join-layout" onClick={this.onJoinApp.bind(this)}>
                <View className="join-layout-btn btn">加入圈子</View>
              </View>
            )
        }


      </View>
    )
  }
}

export default Home
