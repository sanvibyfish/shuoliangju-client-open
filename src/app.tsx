/** @format */

import Taro, {Component, Config} from '@tarojs/taro'
import {Provider} from '@tarojs/redux'
import dva from './utils/dva'
import './utils/request'
import {globalData} from './utils/common'

import models from './models'
import featureModels from './feature-pages/models'
import Home from './pages/home/home'
import Index from './pages/index/index'
import Me from './pages/me/me'
import './app.scss'
import Storage from './utils/storage'
import fundebug from 'fundebug-wxjs'
import EventCenter from './utils/event-center'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5') {
  require('nerv-devtools')
}

// var vConsole = new VConsole({});

const dvaApp = dva.createApp({
  initialState: {},
  models: [...models,...featureModels],
  onReducer: (reducer) => {
    return (state, action) => {
      let newState = reducer(state, action);
      if(action.type === 'reset') {
        newState = {
          loading: state.loading
        }
      }
      return { ...newState }    
    }
  }
})
const store = dvaApp.getStore()

class App extends Component {
  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    plugins: {
      "chatGroupPlugin": {
          "version": "1.0.2",
          "provider": "wxaae6519cee98d824"
      }
    },
    pages: [
      'pages/me/me',
      'pages/index/index',
      'pages/home/home',
      'pages/post-detail/post-detail',
      'pages/register/register',
      'pages/login/login',
      'pages/loginPassword/loginPassword',
      'pages/profile/profile',
      'pages/new-post/new-post',
      'pages/section-detail/section-detail',
      'pages/choose-sections/choose-sections',
      'pages/input-form/input-form',
      'pages/message/message',
      'pages/like-messages/like-messages',
      'pages/comment-messages/comment-messages',
      'pages/user-profile/user-profile',
      'pages/like-posts/like-posts',
      'pages/me-posts/me-posts',
      'pages/star-posts/star-posts',
      'pages/follower-list/follower-list',
      'pages/following-list/following-list',
      'pages/article/article',
      'pages/article-detail/article-detail',
      'pages/create-app/create-app',
      'pages/new-article/new-article',
      'pages/discover/discover',
      'pages/app-detail/app-detail',
      'pages/app-members/app-members',
      'pages/message-subscribe/message-subscribe',
      'pages/product-list/product-list',
      'pages/create-product/create-product',
      'pages/setting/setting',
      'pages/user-info/user-info',
      'pages/webview-page/webview-page',
      'pages/product-detail/product-detail',
    ],
    subPackages: [{
      "root": "feature-pages",
      "pages": [
        'pages/feature-home/feature-home',
        'pages/group-list/group-list',
        'pages/create-group/create-group',
        'pages/group-detail/group-detail'

      ]
    }],
    window: {
      backgroundTextStyle: 'dark',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black',
      enablePullDownRefresh: true,
    },
    tabBar: {
      list: [
        {
          pagePath: 'pages/me/me',
          text: '首页',
          iconPath: './assets/images/tab_home.png',
          selectedIconPath: './assets/images/tab_home_s.png',
        },
        {
          pagePath: 'pages/message/message',
          text: '消息',
          iconPath: './assets/images/tab_message.png',
          selectedIconPath: './assets/images/tab_message_s.png',
        },
        {
          pagePath: 'pages/setting/setting',
          text: '设置',
          iconPath: './assets/images/tab_setting.png',
          selectedIconPath: './assets/images/tab_setting_s.png',
        },

      ],
      color: '#8a8a8a',
      selectedColor: '#2d8cf0',
      backgroundColor: '#ffffff',
      borderStyle: 'white',
    },
    permission: {
      'scope.userLocation': {
        desc: '小程序想获取您的位置信息',
      },
      'scope.userInfo': {
        desc: '小程序想获取您的用户信息',
      },
      'scope.writePhotosAlbum': {
        desc: '小程序想获取您的图片读写权限',
      },
    },
  }

  componentWillMount(){
    if (process.env.NODE_ENV !== 'production') {
      // fundebug.init({
      //   apikey : '9a7e84a3a3a69e0e9beb99c8df7931ab07bba4464687a4ff35c5ddec9bc6ebb5'
      // })
    }
  }
  /**
   *
   *  1.小程序打开的参数 globalData.extraData.xx
   *  2.从二维码进入的参数 globalData.extraData.xx
   *  3.获取小程序的设备信息 globalData.systemInfo
   */
  async componentDidMount() {
  

    // 获取参数
    const referrerInfo = this.$router.params.referrerInfo
    const query = this.$router.params.query
    !globalData.extraData && (globalData.extraData = {})
    if (referrerInfo && referrerInfo.extraData) {
      globalData.extraData = referrerInfo.extraData
    }
    if (query) {
      globalData.extraData = {
        ...globalData.extraData,
        ...query,
      }
    }

    // 获取设备信息
    const sys = await Taro.getSystemInfo()
    sys && (globalData.systemInfo = sys)
    globalData.token = Storage.get(Storage.TOKEN)
    globalData.userInfo = Storage.get(Storage.USER_INFO)
    globalData.openid = Storage.get(Storage.OPENID)
    if (globalData.token) {
      globalData.hasLogin = true
    }
    //获取config
    const response = await store.dispatch({
      type: 'app/getConfig'
    })
    if(response) {
      Storage.set(Storage.CONFIG,response)
      globalData.config = response
      Taro.eventCenter.trigger(EventCenter.CONFIG_UPDATE)
    } else {
      globalData.config = Storage.get(Storage.CONFIG)
    }
  }

  componentDidShow() {}

  componentDidHide() {}

  componentDidCatchError() {}

  render() {
    return (
      <Provider store={store}>
        <Me />
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
