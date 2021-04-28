
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Textarea, Form, Button, Image } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import Api from '../../utils/request'
import './create-product.scss'
import { BaseProps } from '../../utils/base.interface'
import { J2Input } from '../../components'
import Tips from '../../utils/tips'
import { Router } from '../../config/router'
/**
 * create-product.state 参数类型
 *
 * @export
 * @interface CreateProductState
 */
export interface CreateProductState {
  image: string | null
  disable: boolean
  images: string[]
}

/**
 * createProduct.props 参数类型
 *
 * @export
 * @interface CreateProductProps
 */
export interface CreateProductProps extends BaseProps { }

@connect(({ createProduct, entities, loading }) => ({
  ...createProduct,
  entities: entities,
  loading: loading.models.createProduct
}))

class CreateProduct extends Component<CreateProductProps, CreateProductState> {
  config: Config = {
    navigationBarTitleText: '创建产品图册'
  }
  constructor(props: CreateProductProps) {
    super(props)
    this.state = {
      image: null,
      disable: false,
      images: []
    }
  }

  componentDidMount() {

  }


  async choooseImage() {
    const count = 9 - this.state.images.length
    Taro.chooseImage({ count: count }).then(res => {
      if (res.tempFilePaths) {
        this.setState({
          images: this.state.images.concat(res.tempFilePaths),
        })
      }
    })
  }


  async onSubmit(e) {
    let img
    const { body, price } = e.detail.value

    if (price) {
      if (!this.isMoney(price)) {
        return null
      }
      if (parseFloat(price) <= 0) {
        Tips.failure("请输入合法的金额")
        return null
      }
    }

    Tips.loading("提交中")
    this.setState({
      disable: true
    })
    let blob_ids

    if (this.state.images) {
      let uploadImages = await Promise.all(this.state.images.map(async (image, index) => {
        let compressRes = await Taro.compressImage({
          src: image, // 图片路径
          quality: 80 // 压缩质量
        })
        console.log(compressRes.tempFilePath)
        return compressRes.tempFilePath
      }))
      console.log(uploadImages)
      blob_ids = await this.props.dispatch({
        type: 'attachment/multiUpload',
        payload: {
          filePaths: uploadImages
        },
      })
    }

    if (!blob_ids) {
      Tips.failure('请上传产品图片')
      this.setState({
        disable: false
      }, () => {
        Tips.loaded()
      })
    } else {
      let response = await this.props.dispatch({
        type: 'product/createProduct',
        payload: {
          images: blob_ids,
          body: body,
          //分
          price: price * 100,
          img: img,
        }
      })

      this.setState({
        disable: false
      }, () => {
        if (response) {
          Tips.loaded()
          Router.back()
        }
      })
    }
  }

  isMoney(val) {//22,111,22.11   判断是否是金额
    var reg = new RegExp("^[0-9]+([.]{1}[0-9]{0,2}){0,1}$");
    if (val == '') {
      Tips.failure('额度不能为空')
      return false
    } else if (!reg.test(val)) {
      Tips.failure('额度格式错误,只允许两位小数')
      return false
    } else {
      return true
    }
  }

  removeImage(index, e) {
    let images = this.state.images
    images.splice(index, 1)
    this.setState({
      images: images,
    })
  }

  previewImage(index, e) {
    Taro.previewImage({ urls: this.state.images, current: this.state.images[index] }).then(res => { })
  }

  render() {
    const { disable } = this.state
    return (
      <View className='container'>
        <View className="create-product">
          <Form onSubmit={this.onSubmit.bind(this)}>
            <View className="images">
              {this.state.images &&
                this.state.images.map((image, index) => {
                  return (
                    <View className="image">
                      <View className="btn-layout" onClick={this.removeImage.bind(this, index)}>
                        <View className="remove">
                          <Text className="iconfont icon-close remove-btn" />
                        </View>
                      </View>
                      <Image mode="aspectFill" src={image} onClick={this.previewImage.bind(this, index)} />
                    </View>
                  )
                })}
              {this.state.images.length < 9 ? (
                <View className="add-layout image" onClick={this.choooseImage.bind(this)}>
                  <Text className="iconfont icon-add-select add" />
                </View>
              ) : (
                  ''
                )}
            </View>

            <View className="new-product-input">
              <Textarea name="body" placeholder="介绍你的产品名称，特色等" className="product-input" maxlength="-1" />
            </View>
            <View className="create-product-inputs">
              <J2Input label="产品价格" placeholder="金额选填" name="price" type="digit" style="box-shadow: 0 0rpx 0rpx rgba(0, 0, 0, 0.04) !important;" />
            </View>
            <Button className="btn product-btn" formType="submit" disabled={disable}>
              发布
            </Button>
          </Form>
        </View>
      </View>
    )
  }
}
export default CreateProduct
