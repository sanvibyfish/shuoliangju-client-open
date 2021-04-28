
import Taro, { Component, Config,useReachBottom } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import Api from '../../utils/request'
import './discover.scss'
import { BaseProps } from '../../utils/base.interface'
import { J2Posts } from '../../components'
import EntityUtils from '../../utils/entity_utils'
import EventCenter from '../../utils/event-center'
import AppUtils from '../../utils/app-utils'
/**
 * discover.state 参数类型
 *
 * @export
 * @interface DiscoverState
 */
export interface DiscoverState { 
  page: number
}

/**
 * discover.props 参数类型
 *
 * @export
 * @interface DiscoverProps
 */
export interface DiscoverProps extends BaseProps {
  postIds: Array<number>
  isLast: boolean
}

@connect(({ discover, entities, loading }) => ({
  ...discover,
  entities: entities,
  loading: loading.models.discover
}))

class Discover extends Component<DiscoverProps, DiscoverState> {
  config: Config = {
    navigationBarTitleText: '发现'
  }
  constructor(props: DiscoverProps) {
    super(props)
    this.state = {
      page: 1
    }
  }

  componentDidMount() {
  }
  componentDidShow() {
    AppUtils.uploadBadge()
  }

  componentWillUnmount() {
    Taro.eventCenter.off(EventCenter.DESTROY_POST)
    Taro.eventCenter.off(EventCenter.LOGIN_SUCCESS)
  }
  componentWillMount(){
    this.getPosts()
    Taro.eventCenter.on(EventCenter.DESTROY_POST, () => {
      this.onPullDownRefresh()
    })
    Taro.eventCenter.on(EventCenter.LOGIN_SUCCESS, () => {
      this.onPullDownRefresh()
    })
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

  getPosts() {
    this.props.dispatch({
      type: 'discover/getPosts',
      payload: {
        page: this.state.page
      }
    })
  }

  render() {
    const {postIds,entities,isLast} = this.props
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
    
    const posts = EntityUtils.getPosts(entities, postIds)
    return (
      <View className='container'>
        {posts && <J2Posts posts={posts} dispatch={this.props.dispatch} appVisable={true}/>}
      </View>
    )
  }
}
export default Discover
