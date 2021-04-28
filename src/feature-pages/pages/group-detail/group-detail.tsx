
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import Api from '../../../utils/request'
import './group-detail.scss'
import { BaseProps } from '../../../utils/base.interface'
import { Router } from '../../../config/router'
import EntityUtils from '../../../utils/entity_utils'
import Permissions from '../../../utils/permissions'
/**
 * group-detail.state 参数类型
 *
 * @export
 * @interface Group-detailState
 */
export interface GroupDetailState { }

/**
 * groupDetail.props 参数类型
 *
 * @export
 * @interface GroupDetailProps
 */
export interface GroupDetailProps extends BaseProps {
  groupId: number
}

@connect(({ groupDetail, entities, loading }) => ({
  ...groupDetail,
  entities: entities,
  loading: loading.models.groupDetail
}))

class GroupDetail extends Component<GroupDetailProps, GroupDetailState> {
  config: Config = {
    navigationBarTitleText: '群信息详情'
  }
  constructor(props: GroupDetailProps) {
    super(props)
    this.state = {}
  }

  componentWillMount() {
    let params = Router.getParams(this.$router.params)
    this.props.dispatch({
      type: 'groupDetail/getGroup',
      payload: {
        id: params.groupId,
      },
    })
  }

  componentDidMount() {

  }

    // 保存图片至本地
    saveToAlbum = async (url) => {
      Permissions.openPhotosAlbum()
      .then(async(response) => {
        const filePath = `${wx.env.USER_DATA_PATH}/${Date.now()}.jpg`
        // 通过获取本地临时文件路径进行图片的保存，此文件路径是我们自己指定了文件类型，所以不会出现文件类型识别失败的情况。
        const file = await Taro.downloadFile({
          url
        })
        const res = await Taro.saveImageToPhotosAlbum({
          filePath: file.tempFilePath
        })
        // this.setState({
        //   isShowing: false
        // })
        if (res.errMsg === 'saveImageToPhotosAlbum:ok') {
          Taro.showToast({
            title: '保存图片成功',
            icon: 'success',
            duration: 2000,
          })
          // 保存成功之后移除缓存释放机身空间
          let fileMgr = Taro.getFileSystemManager()
          fileMgr.unlink({ filePath })
        }
      })
      .catch(err => {
        console.log(err)
      })




    }

  render() {
    const { groupId, entities } = this.props
    let group = EntityUtils.getGroup(entities, groupId)
    console.log(group)
    return (
      <View className='container'>
        <View className='group-detail'>
          <Image className="group-detail-img" src={group.logo_url} mode="scaleToFill"></Image>
          <View className="group-detail-header"> {group.name}</View>
          <View className="group-detail-summary"> {group.summary}</View>
          <Image className="group-detail-img" src={group.qrcode_url} mode="aspectFit"></Image>
          <View className="btn group-detail-save" onClick={this.saveToAlbum.bind(this,group.qrcode_url)}>保存二维码</View>
        </View>
      </View>
    )
  }
}
export default GroupDetail
