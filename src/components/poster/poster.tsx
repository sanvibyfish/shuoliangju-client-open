import Taro, { Component } from '@tarojs/taro'
import { View,ScrollView,Button,Image} from '@tarojs/components'
import TaroCanvasDrawer from 'taro-plugin-canvas'
import './poster.scss'
import Tips from '../../utils/tips'
/**
 * poster.state 参数类型
 *
 * @export
 * @interface PosterState
 */
export interface PosterState {
  image: string
}

/**
 * poster.props 参数类型
 *
 * @export
 * @interface PosterProps
 */
export interface PosterProps {
  onClose(): any
  isShowing: boolean,
  config: any
}

/**
 * 海报组件
 */
class Poster extends Component<PosterProps,PosterState> {
  constructor(props: PosterProps) {
    super(props)
    this.state = {
      image: "",
    }
  }
  static options = {
    addGlobalClass: true
  }
  static defaultProps:PosterProps = {}

  // 绘制成功回调函数 （必须实现）=> 接收绘制结果、重置 TaroCanvasDrawer 状态
  onCreateSuccess = result => {
    const { tempFilePath, errMsg } = result
    Tips.loaded()
    if (errMsg === 'canvasToTempFilePath:ok') {
      console.log(tempFilePath)
      this.setState({
        image: tempFilePath,
      })
    } else {
      Taro.showToast({ icon: 'none', title: errMsg || '出现错误' })
      console.log(errMsg)
    }
    // 预览
    // Taro.previewImage({
    //   current: tempFilePath,
    //   urls: [tempFilePath]
    // })
  }
  onCloseShareImage(e){
    this.props.onClose()
  }

    // 绘制失败回调函数 （必须实现）=> 接收绘制错误信息、重置 TaroCanvasDrawer 状态
    onCreateFail = error => {
      Tips.loaded()
      console.log(error)
    }

  // 保存图片至本地
  saveToAlbum = async () => {
    const res = await Taro.saveImageToPhotosAlbum({
      filePath: this.state.image,
    })
    // this.setState({
    //   isShowing: false
    // })
    if (res.errMsg === 'saveImageToPhotosAlbum:ok') {
      this.props.onClose()
      Taro.showToast({
        title: '保存图片成功',
        icon: 'success',
        duration: 2000,
      })
  
    }
  }

  render() {
    const {isShowing} = this.props
    const {image} = this.state
    return (
      <View className='posters'>
        {isShowing && (
          <View className="canvas-wrap">
            <View className="canvas-wrap-mask">
              <View className="canvas-wrap-mask-back" onClick={this.onCloseShareImage.bind(this)}>
                轻触返回
              </View>
              {image && (
                <ScrollView scrollY>
                  <View className="canvas-wrap-mask-image">
                    <Image className="shareImage" src={image} mode="widthFix" />
                  </View>
                </ScrollView>
              )}

              <TaroCanvasDrawer
                config={this.props.config}
                onCreateSuccess={this.onCreateSuccess} // 绘制成功回调
                onCreateFail={this.onCreateFail} // 绘制失败回调
              />

              <Button onClick={this.saveToAlbum} className="posters-save-btn btn">
                保存到相册
              </Button>
            </View>
          </View>
        )}
      </View>
    )
  }
}

export default Poster
