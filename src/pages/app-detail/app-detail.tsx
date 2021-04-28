
import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import Api from '../../utils/request'
import './app-detail.scss'
import { BaseProps } from '../../utils/base.interface'
import { J2Input, J2ListItem } from '../../components'
import { Router } from '../../config/router'
import EntityUtils from '../../utils/entity_utils'
import Tips from '../../utils/tips'
import { globalData } from '../../utils/common'
/**
 * app-detail.state 参数类型
 *
 * @export
 * @interface App-detailState
 */
export interface AppDetailState {
  appId: number | null
  logo: string | null
  tempApp: object | null
  input: object | null
}

/**
 * appDetail.props 参数类型
 *
 * @export
 * @interface AppDetailProps
 */
export interface AppDetailProps extends BaseProps {
}

@connect(({ appDetail, entities, loading }) => ({
  ...appDetail,
  entities: entities,
  loading: loading.models.appDetail
}))

class AppDetail extends Component<AppDetailProps, AppDetailState> {
  config: Config = {
    navigationBarTitleText: '圈子信息'
  }
  constructor(props: AppDetailProps) {
    super(props)
    this.state = {
      appId: null,
      logo: null,
      input: null,
      tempApp: null
    }
  }

  componentWillMount() {
    let params = Router.getParams(this.$router.params)
    this.setState({
      appId: params.appId
    })
  }

  onLogoChange() {
    Taro.chooseImage({ count: 1 }).then(res => {
      if (res.tempFilePaths) {
        this.setState({
          logo: res.tempFilePaths[0],
        })
      }
    })
  }

  onNameChange(app) {
    Router.navigateTo(Router.INPUT_FORM, {
      value: app.name,
      title: '设置圈子名称',
      key: "name"
    })
  }

  onSummaryChange(app) {
    Router.navigateTo(Router.INPUT_FORM, {
      value: app.summary,
      title: '设置圈子简介',
      key: 'summary'
    })
  }

  onNavgateUserProfile(user) {
    Router.navigateTo(Router.USER_PROFILE, {
      userId: user.id,
      title: user.nick_name
    })
  }


  onNavgateAppMembers() {
    Router.navigateTo(Router.APP_MEMBERS, {
      appId: this.state.appId
    })
  }

  

  componentDidShow() {
    const { input, tempApp } = this.state
    if (input && input.back) {
      if (input.key == "name") {
        this.setState({
          input: {
            back: false,
          },
          tempApp: {
            ...tempApp,
            name: input.value
          }
        })
      } else if (input.key == "summary") {
        this.setState({
          input: {
            back: false,
          },
          tempApp: {
            ...tempApp,
            summary: input.value
          }
        })
      }
    }
  }


  async onSave() {
    if (this.state.logo) {
      Tips.loading("提交中",true)
      const attachment = await this.props.dispatch({
        type: 'attachment/upload',
        payload: {
          filePath: this.state.logo,
        },
      })
      if (!attachment) {
        Tips.failure('发布失败，请稍候重试')
        Tips.loaded()
        return null
      } else {
        let response = await this.props.dispatch({
          type: 'app/updateApp',
          payload: {
            ...this.state.tempApp,
            logo: attachment.blob_id,
            id: this.state.appId
          }
        })
        if(response) {
          Tips.loaded()
          Router.back()  
        }
        
      }
    } else {
      let response = await this.props.dispatch({
        type: 'app/updateApp',
        payload: {
          ...this.state.tempApp,
          id: this.state.appId
        }
      })
      if(response) {
        Tips.loaded()
        Router.back()  
      }
    }
  }

  async onExitApp() {
    let response = await this.props.dispatch({
      type: 'app/exitApp',
      payload: {
        id: this.state.appId
      }
    })
    if(response) {
      Router.back()
    }
  }


  render() {
    const { entities } = this.props
    const { appId, logo, tempApp } = this.state
    let app = EntityUtils.getApp(entities, appId)
    if(!app) return <View/>
    let isOwn = false
    if(app && globalData.userInfo) {
      isOwn = (app.own.id == globalData.userInfo.id)
    } 
    return (
      <View className='container'>
        <J2ListItem label="封面图" image={logo ? logo : app.logo_url} onClick={isOwn ? this.onLogoChange.bind(this) : null} arrow={isOwn}></J2ListItem>
        <J2ListItem label="圈子名称" value={(tempApp && tempApp.name) ? tempApp.name : app.name} onClick={isOwn ? this.onNameChange.bind(this, app) : null} arrow={isOwn}></J2ListItem>
        <J2ListItem label="圈子简介" value={(tempApp && tempApp.summary) ? tempApp.summary : app.summary} onClick={isOwn ? this.onSummaryChange.bind(this, app) : null} arrow={isOwn}> ></J2ListItem>
        <J2ListItem label="圈主" value={app.own.nick_name} onClick={this.onNavgateUserProfile.bind(this, app.own)}></J2ListItem>
        <J2ListItem label="成员" value={app.users_count ? `${app.users_count}人` : ""} onClick={this.onNavgateAppMembers.bind(this)}></J2ListItem>
        {
          isOwn && (<View className="btn save" onClick={this.onSave.bind(this)}>
            保存
          </View>)
        }

        {
          (!isOwn && !app.abilities.join && globalData.userInfo) && (
            <View className="btn exit" onClick={this.onExitApp.bind(this)}>
              退出圈子
            </View>
          )
        }

      </View>
    )
  }
}
export default AppDetail
