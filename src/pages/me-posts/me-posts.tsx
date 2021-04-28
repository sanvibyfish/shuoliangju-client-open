/** @format */

import Taro, { Component, Config, useReachBottom } from '@tarojs/taro'
import { View,Image } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import './me-posts.scss'
import { BaseProps } from '../../utils/base.interface'
import Model from '../../utils/model'
import { J2Posts } from '../../components'
import { post } from '../../models/schema'
import { denormalize } from 'normalizr'
import { Router } from '../../config/router'
/**
 * Me-posts.state 参数类型
 *
 * @export
 * @interface Me-postsState
 */
export interface MePostsState {
  page: number
  userId: string | null
}

/**
 * MePosts.props 参数类型
 *
 * @export
 * @interface MePostsProps
 */
export interface MePostsProps extends BaseProps {
  isLast: boolean
  posts: Array<Model.Post>,
  entities: object
}

@connect(({ mePosts, entities, loading }) => ({
  ...mePosts,
  entities: entities,
  loading: loading.models.mePosts,
}))
class MePosts extends Component<MePostsProps, MePostsState> {
  config: Config = {
    navigationBarTitleText: '我的帖子',
  }
  constructor(props: MePostsProps) {
    super(props)
    this.state = {
      page: 1,
      userId: null
    }
  }

  componentDidMount() { }


  async getPosts() {



    await this.props.dispatch({
      type: 'mePosts/getPosts',
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
    const isNotEmpty = (posts && posts.length > 0)
    return (
      <View className={`${isNotEmpty ? "container" : "empty-container"}`}>
        {
          isNotEmpty ? (
            <View className="me-posts">
            {posts && <J2Posts posts={denormalize(posts, [post], this.props.entities)} dispatch={this.props.dispatch} />}
          </View>
          ): (
            <View className="empty-bg">
            <Image src="https://shuoliangju-cn.oss-cn-qingdao.aliyuncs.com/production/config/undraw_post2_19cj.png" mode="aspectFit"></Image>
            <View className="empty-bg-tips">还没有任何帖子~</View>
          </View>
          )
  }

      </View>
    )
  }
}
export default MePosts
