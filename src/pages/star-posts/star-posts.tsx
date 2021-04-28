/** @format */

import Taro, { Component, Config, useReachBottom } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import './star-posts.scss'
import { BaseProps } from '../../utils/base.interface'
import Model from '../../utils/model'
import { J2Posts } from '../../components'
import { post } from '../../models/schema'
import { denormalize } from 'normalizr'
import { Router } from '../../config/router'
/**
 * like-posts.state 参数类型
 *
 * @export
 * @interface Like-postsState
 */
export interface StarPostsState {
  page: number
  userId: string | null
}

/**
 * StarPosts.props 参数类型
 *
 * @export
 * @interface StarPostsProps
 */
export interface StarPostsProps extends BaseProps {
  isLast: boolean
  posts: Array<Model.Post>,
  entities: object
}

@connect(({ starPosts, entities, loading }) => ({
  ...starPosts,
  entities: entities,
  loading: loading.models.starPosts,
}))
class StarPosts extends Component<StarPostsProps, StarPostsState> {
  config: Config = {
    navigationBarTitleText: '我的收藏',
  }
  constructor(props: StarPostsProps) {
    super(props)
    this.state = {
      page: 1,
      userId: null
    }
  }

  componentDidMount() { }


  async getPosts() {
    await this.props.dispatch({
      type: 'starPosts/getPosts',
      payload: {
        id: this.state.userId,
        page: this.state.page
      },
    })
  }

  componentWillMount() {
    let params = Router.getParams(this.$router.params)
    this.setState({
      userId: params.userId
    }, () => {
      this.getPosts()
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


  render() {
    const { loading, isLast, posts } = this.props
    const isNotEmpty = (posts && posts.length > 0)
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

    return (
      <View className={`${isNotEmpty ? "container" : "empty-container"}`}>
        {
          isNotEmpty ? (
            <View className="star-posts">
              {posts && <J2Posts posts={denormalize(posts, [post], this.props.entities)} dispatch={this.props.dispatch} />}
            </View>
          ) : (
              <View className="empty-bg">
                <Image src="https://shuoliangju-cn.oss-cn-qingdao.aliyuncs.com/production/config/undraw_collecting_fjjl.png" mode="aspectFit"></Image>
                <View className="empty-bg-tips">还没有任何收藏~</View>
              </View>
            )
        }

      </View>
    )
  }
}
export default StarPosts
