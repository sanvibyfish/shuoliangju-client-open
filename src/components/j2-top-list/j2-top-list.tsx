/** @format */

import Taro, {Component} from '@tarojs/taro'
import {View} from '@tarojs/components'
import './j2-top-list.scss'
import {Router} from '../../config/router'
declare namespace J2TopList {
  /**
   * j2TopList.state 参数类型
   *
   * @export
   * @interface J2TopListState
   */
  interface J2TopListState {}

  /**
   * j2-top-list.props 参数类型
   *
   * @export
   * @interface J2TopListProps
   */
  interface J2TopListProps {
    topList: Array<Post>
  }
}

class J2TopList extends Component<J2TopList.J2TopListProps, J2TopList.J2TopListState> {
  constructor(props: J2TopList.J2TopListProps) {
    super(props)
    this.state = {}
  }
  static options = {
    addGlobalClass: true,
  }
  static defaultProps: J2TopList.J2TopListProps = {
    topList: [],
  }

  onNavgateToPostDetail(postId, e) {
    Router.navigateTo(Router.POST_DETAIL, {
      postId: postId,
    })
  }

  render() {
    const {topList} = this.props
    
    if (!topList) return <View />
    return (
      <View className="j2-top-list">
        {topList.map((item, index) => (
          <View className="j2-top-list-top" onClick={this.onNavgateToPostDetail.bind(this, item.id)}>
            <View className="j2-top-list-top-icon">置顶</View>
            <View className="j2-top-list-top-text">{item.body && item.body != "" ? item.body : item.images_url.map((item)=> '[查看图片]').join('')}</View>
          </View>
        ))}
      </View>
    )
  }
}

export default J2TopList
