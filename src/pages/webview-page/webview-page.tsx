
import Taro, { Component, Config } from '@tarojs/taro'
import { View,WebView } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import Api from '../../utils/request'
import './webview-page.scss'
import { BaseProps } from '../../utils/base.interface'
import { Router } from '../../config/router'
/**
 * webview-page.state 参数类型
 *
 * @export
 * @interface Webview-pageState
 */
export interface WebviewPageState { 
  title: string
  url: string
}

/**
 * webviewPage.props 参数类型
 *
 * @export
 * @interface WebviewPageProps
 */
export interface WebviewPageProps extends BaseProps { }

@connect(({ webviewPage, entities, loading }) => ({
  ...webviewPage,
  entities: entities,
  loading: loading.models.webviewPage
}))

class WebviewPage extends Component<WebviewPageProps, WebviewPageState> {
  config: Config = {
    navigationBarTitleText: '网页'
  }
  constructor(props: WebviewPageProps) {
    super(props)
    this.state = {
      url: '',
      title: ''
    }
  }

  componentWillMount() {
    let params = Router.getParams(this.$router.params)
    this.setState({
      url: params.url,
      title: params.title
    }, () => {
      Taro.setNavigationBarTitle({
        title: this.state.title
      })
    });
  }
  componentDidMount() {

  }


  render() {
    return (
      <WebView src={this.state.url} />
    )
  }
}
export default WebviewPage
