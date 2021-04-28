/** @format */

import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text, ScrollView } from '@tarojs/components'
import './sections.scss'
import { Router } from '../../config/router'

/**
 * sections.state 参数类型
 *
 * @export
 * @interface SectionsState
 */
interface SectionsState { }

/**
 * sections.props 参数类型
 *
 * @export
 * @interface SectionsProps
 */
interface SectionsProps {
  items: Array<any> | null
  appId: number | null
}

class Sections extends Component<SectionsProps, SectionsState> {
  constructor(props: SectionsProps) {
    super(props)
    this.state = {}
  }
  static options = {
    addGlobalClass: true,
  }
  static defaultProps: SectionsProps = {
    items: null,
    appId: null
  }

  handlerNavgatePosts(section: any) {
    Router.navigateTo(Router.SECTION_DETAIL, {
      sectionId: section.id,
      appId: this.props.appId
    })
  }

  render() {
    const { items } = this.props
    if (!items) return <View />

    return (
      <View className="sections">
        {items &&
          items.map(item => {
            return (
              <View className="section" onClick={this.handlerNavgatePosts.bind(this, item)}>
                <Image className="section-image" src={item.icon_url}></Image>
                <Text className="section-text">{item.name}</Text>
                <Text className="section-button iconfont icon-arrow-right"></Text>
              </View>
            )
          })}
      </View>
    )
  }
}

export default Sections
