
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Button } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import './product-detail.scss'
import { BaseProps } from '../../utils/base.interface'
import EntityUtils from '../../utils/entity_utils'
import { Router } from '../../config/router'
import { globalData } from '../../utils/common'
import EventCenter from '../../utils/event-center'
/**
 * product-detail.state 参数类型
 *
 * @export
 * @interface Product-detailState
 */
export interface ProductDetailState {
  productId: string | null
}

/**
 * productDetail.props 参数类型
 *
 * @export
 * @interface ProductDetailProps
 */
export interface ProductDetailProps extends BaseProps { }

@connect(({ product, entities, loading }) => ({
  ...product,
  entities: entities,
  loading: loading.models.product
}))

class ProductDetail extends Component<ProductDetailProps, ProductDetailState> {
  config: Config = {
    navigationBarTitleText: '产品图册详情'
  }
  constructor(props: ProductDetailProps) {
    super(props)
    this.state = {
      productId: null
    }
  }

  componentWillMount() {
    let params = Router.getParams(this.$router.params)
    this.setState({
      productId: params.productId
    }, () => {
      this.getProduct()
    })
  }

  componentWillUnmount() {
  }

  getProduct() {
    this.props.dispatch({
      type: 'product/getProduct',
      payload: {
        id: this.state.productId
      }
    })
  }

  onPullDownRefresh() {
    this.getProduct()
  }

  componentDidMount() {

  }

  onShareAppMessage() {
    return {
      title: `${globalData.userInfo ? globalData.userInfo.nick_name : ""}给你分享了一个产品图册`,
    }
  }

  previewImage(index, e) {
    const product = EntityUtils.getProduct(this.props.entities, this.state.productId)
    Taro.previewImage({ urls: product.images_url, current: product.images_url[index] }).then(res => { })
  }


  async deleteProduct() {
    let response = await this.props.dispatch({
      type: 'product/destroy',
      payload: {
        id: this.state.productId
      }
    })
    if(response) {
      Router.back()
    }
  }

  render() {
    const { productId } = this.state
    const { entities } = this.props
    const product = EntityUtils.getProduct(entities, productId)
    return (
      <View className='container'>
        <View className="images">
          {product.thumbnails_url &&
            product.thumbnails_url.map((image, index) => {
              return (
                <View className="image">
                  <Image mode="aspectFill" src={image} onClick={this.previewImage.bind(this, index)} />
                </View>
              )
            })}
        </View>
        <View className="body">
          {product.body}
        </View>
        {
          (product.price && product.price != 0) && (
            <View className="price">
              产品价格 ￥{product.price / 100}
            </View>
          )
        }
        <View className="product-buttons">
          <View className="btn del-btn" onClick={this.deleteProduct.bind(this)}>删除</View>
          <Button openType="share" >
            <View className="btn share-btn">分享</View>
          </Button>

        </View>
      </View>
    )
  }
}
export default ProductDetail
