import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Text, Button } from '@tarojs/components'
import './j2-group-tab.scss'
import { connect } from '@tarojs/redux'
import wechatPng from '../../assets/images/wechat.png'
import imagePng from '../../assets/images/image.png'
import { Router } from '../../config/router'
import { PostModel, AppModel, SectionModel } from '../../models/data/model'
import { J2TopList, Sections, Poster } from '../../components'
import Tips from '../../utils/tips'
import { globalData } from '../../utils/common'

/**
 * j2-group-tab.state 参数类型
 *
 * @export
 * @interface J2-group-tabState
 */
export interface J2GroupTabState {
  isShareImage: boolean
  shareConfig: any
}

/**
 * j2GroupTab.props 参数类型
 *
 * @export
 * @interface J2GroupTabProps
 */
export interface J2GroupTabProps {
  currentTabIndex: number
  posts: PostModel[],
  app: AppModel
  sections: SectionModel[]
  entities: any
  dispatch: any
}
@connect(({  entities }) => ({
  entities: entities,
}))
class J2GroupTab extends Component<J2GroupTabProps, J2GroupTabState> {
  constructor(props: J2GroupTabProps) {
    super(props)
    this.state = {
      isShareImage: false,
      shareConfig: null
    }
  }

  static options = {
    addGlobalClass: true
  }
  static defaultProps: J2GroupTabProps = {
    currentTabIndex: 1,
    posts: [],
    app: null,
    sections: []
  }
  componentWillMount() {
  }


  onCloseShareImage() {
    this.setState({
      isShareImage: false,
    })
  }


  onNavgateArticle() {
    Router.navigateTo(Router.ARTICLE, {
      appId: this.props.app.id
    })
  }

  onNavgateAppDetail() {
    Router.navigateTo(Router.APP_DETAIL, {
      appId: this.props.app.id
    })
  }

  async genShareImageJson() {
    const {app} = this.props
    let qrcode = await this.props.dispatch({
      type: 'app/qrcodeApp',
      payload: {
        id: app.id
      }
    })
    let systemInfo = await Taro.getSystemInfo()
    let json = {
      preload: true,
      width: 750,
      height: 750,
      backgroundColor: '#fff',
      debug: false,
      pixelRatio: systemInfo.pixelRatio,
      blocks: [
        {
          x: 0,
          y: 0,
          width: 750,
          height: 950,
          paddingLeft: 0,
          paddingRight: 0,
          borderWidth: 0,
          backgroundColor: '#f4f4f4',
          borderRadius: 0,
        },
        {
          x: 0,
          y: 0,
          width: 750,
          height: 520,
          paddingLeft: 0,
          paddingRight: 0,
          borderWidth: 0,
          zIndex: 999,
          backgroundColor: 'rgba(0,0,0,.4)',
          borderRadius: 0,
        },

      ],
      texts: [
        {
          x: 40,
          y: 80,
          text: '卢灿伟Sanvi',
          fontSize: 48,
          color: '#ffffff',
          baseLine: 'left',
          lineHeight: 48,
          lineNum: 2,
          fontWeight: 'bold',
          textAlign: 'left',
          width: 580,
          zIndex: 1000,
        },
        {
          x: 375,
          y: 320,
          text: globalData.userInfo.nick_name,
          fontSize: 32,
          color: '#fff',
          baseLine: 'top',
          lineHeight: 48,
          lineNum: 2,
          fontWeight: 'bold',
          textAlign: 'center',
          width: 750,
          zIndex: 1000,
        },
        {
          x: 375,
          y: 375,
          text: "邀请你加入",
          fontSize: 32,
          color: '#fff',
          baseLine: 'top',
          lineHeight: 48,
          lineNum: 2,
          fontWeight: 'bold',
          textAlign: 'center',
          width: 750,
          zIndex: 1000,
        },
        {
          x:  375,
          y: 680,
          text: app.name,
          fontSize: 32,
          color: '#000',
          baseLine: 'top',
          lineHeight: 48,
          lineNum: 2,
          fontWeight: 'bold',
          textAlign: 'center',
          width: 750,
          zIndex: 1000,
        },
        {
          x:  375,
          y: 760,
          text: app.summary,
          fontSize: 32,
          color: '#000',
          baseLine: 'top',
          lineHeight: 48,
          lineNum: 2,
          textAlign: 'center',
          width: 750,
          zIndex: 1000,
        },
      ],
      images: [
        {
          url: `${app.logo_url}?x-oss-process=image/resize,m_fill,h_228`,
          width: 750,
          height: 520,
          y: 0,
          x: 0,
          zIndex: 10,
          // borderRadius: 150,
          // borderWidth: 10,
          // borderColor: 'red',
        },
        {
          url: globalData.userInfo.avatar_url,
          width: 80,
          height: 80,
          y: 220,
          x: 325,
          borderRadius: 16,
          zIndex: 1000,
          // borderRadius: 150,
          // borderWidth: 10,
          // borderColor: 'red',
        },
        {
          url: qrcode.url,
          width: 215,
          height: 215,
          y: 540-107,
          x: 375-107,
          zIndex: 1000,
          borderColor: '#000',
          borderWidth: 10,
          // borderColor: 'red',
        },
      ],
      
      lines: [],
    }

    return json
  }

  async draw() {
    let config = await this.genShareImageJson()
    console.log(config)
    this.setState({
      isShareImage: true,
      shareConfig: config,
    })
    Tips.loading('绘制中...')
  }

  render() {
    const { currentTabIndex, posts, app, sections } = this.props
    const {isShareImage, shareConfig} = this.state
    return (
      <View className='j2-header'>
        <View className="j2-header-bg" style={`background:url(${app.logo_url}?x-oss-process=image/resize,m_fill,h_228) no-repeat;background-size:cover;`}>
          <View className="j2-header-bg-mask"></View>
        </View>
        <View className="j2-header-content">
          <View className="j2-header-content-bar">
            <View className="j2-header-content-bar-name" onClick={this.onNavgateAppDetail.bind(this)}>{app.name}<Text className="iconfont icon-arrow-right j2-header-content-bar-icon"></Text></View>
            <View className="j2-header-content-bar-items">
              <Button openType="share" className="j2-header-content-bar-item">
                <Image src={wechatPng} className="j2-header-content-bar-item-icon"></Image>
                <View className="j2-header-content-bar-item-text">微信分享</View>
              </Button>
              <Button className="j2-header-content-bar-item" onClick={this.draw.bind(this)}>
                <Image src={imagePng} className="j2-header-content-bar-item-icon"></Image>
                <View className="j2-header-content-bar-item-text">图片分享</View>
              </Button>
            </View>

          </View>

          <View className="j2-header-content-summary">{app.summary}</View>

          <View className="j2-header-tabs">
            <View className="j2-header-tabs-counts">
              <View className="j2-header-tabs-counts-member">{app.users_count}成员</View>
              <View className="j2-header-tabs-counts-posts">{app.posts_count}帖子</View>
            </View>
          </View>
        </View>
        {
          isShareImage && 
          <Poster onClose={this.onCloseShareImage.bind(this)} isShowing={isShareImage} config={shareConfig}></Poster>
        }
      </View>

    )
  }
}

export default J2GroupTab
