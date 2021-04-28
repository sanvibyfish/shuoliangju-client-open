/** @format */

import Taro, {Component, Config, useReachBottom} from '@tarojs/taro'
import {View, Image, Text} from '@tarojs/components'
import {connect} from '@tarojs/redux'
import './section-detail.scss'
import {BaseProps, BaseStates} from '../../utils/base.interface'
import {Router} from '../../config/router'
import {post} from '../../models/schema'
import {denormalize} from 'normalizr'
import {J2Posts} from '../../components'
import Tips from '../../utils/tips'
import EntityUtils from '../../utils/entity_utils'
import EventCenter from '../../utils/event-center'
/**
 * posts.state 参数类型
 *
 * @export
 * @interface PostsState
 */
export interface IState extends BaseStates{
  currentIndex: number
  page: number
  sectionId: number
}

/**
 * posts.props 参数类型
 *
 * @export
 * @interface PostsProps
 */
export interface IProps extends BaseProps {
  entities: object
  posts?: Array<any>
  isLast: false
}

@connect(({sectionDetail, entities, loading}) => ({
  ...sectionDetail,
  entities: entities,
  loading: loading.models.sectionDetail,
}))
class SectionDetail extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {
      currentIndex: 0,
      page: 1,
    }
  }

  config: Config = {
    enablePullDownRefresh: true,
  }

  componentWillMount() {
    let params = Router.getParams(this.$router.params)
    this.setState(
      { 
        sectionId: params.sectionId,
        appId: params.appId
      },
      () => {
        this.getPosts()
      },
    )
    Taro.eventCenter.on(EventCenter.ADD_NEW_POST, () => {
      this.onPullDownRefresh()
    }) 
  }

  componentWillUnmount(){
    Taro.eventCenter.off(EventCenter.ADD_NEW_POST)
  }


  async getPosts() {
    let type = ''
    if (this.state.currentIndex == 1) {
      type = 'excellent'
    }
    await this.props.dispatch({
      type: 'sectionDetail/getPosts',
      payload: {
        page: this.state.page,
        type: type,
        section_id: this.state.sectionId,
        app_id: this.state.appId
      },
    })
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

  onPullDownRefresh() {
    this.setState(
      {
        page: 1,
      },
      () => {
        this.getPosts()
      },
    )
  }

  handleNavgateNewPost() {
    Router.navigateTo(Router.NEW_POST, {
      sectionId: this.state.sectionId,
      appId: this.state.appId,
    })
  }



  render() {
    const {posts, isLast,entities} = this.props
    const {sectionId,appId} = this.state
    const tabList = [
      {
        id: 1,
        title: '全部',
      },
      {
        id: 2,
        title: '精华',
      },
    ]
    useReachBottom(() => {
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
    })

    const section = EntityUtils.getSection(entities,sectionId)
    if(section) {
      Taro.setNavigationBarTitle({title:section.name})
    }
    let postEntities = EntityUtils.getPosts(entities, posts)
    
    return (
      <View className="container">
        <View className="posts-header">
          <Image className="posts-header-image" src={section.icon_url}></Image>
          <View className="posts-header-info">
            <Text className="posts-header-info-title">{section.name}</Text>
            <Text className="posts-header-info-summary">{section.summary}</Text>
          </View>
        </View>
        <View className="posts-tabs">
          {tabList.map((item, index) => (
            <View className="posts-tabs-item" onClick={this.changeNavState.bind(this, index)} key={item.title}>
              <View className={`tab-title ${index === this.state.currentIndex ? 'tab-title-active' : null}`}>
                {item.title}
              </View>
              <View className={`tab-border ${index === this.state.currentIndex ? 'tab-border-active' : null}`}></View>
            </View>
          ))}
        </View>
        <View className="posts-list">
        {posts && <J2Posts posts={postEntities} dispatch={this.props.dispatch} appId={appId}/>}
        </View>
   
        <View className="add-btn" onClick={this.handleNavgateNewPost.bind(this)}>
          <Text className="iconfont icon-add-select add" />
        </View>
      </View>
    )
  }
}
export default SectionDetail
