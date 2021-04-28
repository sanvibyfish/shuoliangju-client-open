
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import Api from '../../../utils/request'
import './feature-home.scss'
import { BaseProps } from '../../../utils/base.interface'
import { Router } from '../../../config/router'
/**
 * feature-home.state 参数类型
 *
 * @export
 * @interface Feature-homeState
 */
export interface FeatureHomeState { 
  appId: number | null
}

/**
 * featureHome.props 参数类型
 *
 * @export
 * @interface FeatureHomeProps
 */
export interface FeatureHomeProps extends BaseProps { }

@connect(({ featureHome, entities, loading }) => ({
  ...featureHome,
  entities: entities,
  loading: loading.models.featureHome
}))

class FeatureHome extends Component<FeatureHomeProps, FeatureHomeState> {
  config: Config = {
    navigationBarTitleText: '功能实验室'
  }
  constructor(props: FeatureHomeProps) {
    super(props)
    this.state = {
      appId: null
    }
  }

  componentDidMount() {

  }

  componentWillMount(){
    const params = Router.getParams(this.$router.params)
    this.setState({
      appId: params.appId
    })
  }

  onNavgateGroupList() {
    Router.navigateTo(Router.GROUP_LIST, {
      appId: this.state.appId
    })
  }


  onNavgateAppDetail() {
    Router.navigateTo(Router.APP_DETAIL, {
      appId: this.state.appId
    })
  }

  render() {
    return (
      <View className='container'>
        <View className="feature-list">
          <View className="feature-list-header">功能实验室</View>
          <View className="feature-list-summary">一大波功能正在努力开发中...</View>
          <View className="feature-list-items">
            <View className="feature-list-items-item" onClick={this.onNavgateGroupList.bind(this)}>
              <Image className="feature-list-items-item-icon" src="https://shuoliangju-cn.oss-cn-qingdao.aliyuncs.com/production/config/icon_wechat.png"></Image>
              <View className="feature-list-items-item-text">群推广</View>
            </View>
            <View className="feature-list-items-item feature-list-items-item-right" onClick={this.onNavgateAppDetail.bind(this)}>
              <Image className="feature-list-items-item-icon" src="https://shuoliangju-cn.oss-cn-qingdao.aliyuncs.com/production/config/feature_manage_icon.png"></Image>
              <View className="feature-list-items-item-text">圈子管理</View>
            </View>
          </View>
        </View>
      </View>
    )
  }
}
export default FeatureHome
