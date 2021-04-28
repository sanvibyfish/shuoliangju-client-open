
import Taro, { Component, Config, useReachBottom } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import Api from '../../utils/request'
import './product-list.scss'
import { BaseProps } from '../../utils/base.interface'
import EntityUtils from '../../utils/entity_utils'
import { Router } from '../../config/router'
import { globalData } from '../../utils/common'
import EventCenter from '../../utils/event-center'
/**
 * product-list.state 参数类型
 *
 * @export
 * @interface Product-listState
 */
export interface ProductListState {
  page: number
  userId: string | null
}

/**
 * productList.props 参数类型
 *
 * @export
 * @interface ProductListProps
 */
export interface ProductListProps extends BaseProps {
  isLast: boolean
  productIds: Array<number>
}

@connect(({ productList, entities, loading }) => ({
  ...productList,
  entities: entities,
  loading: loading.models.productList
}))

class ProductList extends Component<ProductListProps, ProductListState> {
  config: Config = {
    navigationBarTitleText: '产品图册'
  }
  constructor(props: ProductListProps) {
    super(props)
    this.state = {
      page: 1,
      userId: null
    }
  }

  componentWillUnmount() {
    console.log('DESTROY_PRODUCT unmount')

    Taro.eventCenter.off(EventCenter.CREATE_PRODUCT_SUCCESS)
    Taro.eventCenter.off(EventCenter.DESTROY_PRODUCT)
  }

  componentWillMount() {
    let params = Router.getParams(this.$router.params)
    this.setState({
      userId: params.userId
    }, () => {
      console.log(this.state)
      this.getProducts()
    })

    Taro.eventCenter.on(EventCenter.CREATE_PRODUCT_SUCCESS, () => {
      this.onPullDownRefresh();
    })

    console.log('DESTROY_PRODUCT mount')
    Taro.eventCenter.on(EventCenter.DESTROY_PRODUCT, () => {
      console.log('call mount')
      this.onPullDownRefresh();
    })


  }

  onNavgateToCreateProduct() {
    Router.navigateTo(Router.CREATE_PRODUCT)
  }

  async getProducts() {
    await this.props.dispatch({
      type: 'productList/getProducts',
      payload: {
        target_user_id: this.state.userId,
        page: this.state.page
      }
    })
  }

  onPullDownRefresh() {
    this.setState(
      {
        page: 1,
      },
      () => {
        this.getProducts()
      },
    )
  }

  onNavegateDetail(id) {
    Router.navigateTo(Router.PRODUCT_DETAIL,{
      productId: id
    })
  }


  render() {
    const { isLast, entities, productIds } = this.props

    useReachBottom(() => {
      if (!isLast) {
        this.setState(
          {
            page: this.state.page + 1,
          },
          () => {
            this.getProducts()
          },
        )
      }
    })

    let products = EntityUtils.getProducts(entities, productIds)
    const isNotEmpty = (products && products.length > 0)
    return (
      <View className={`${isNotEmpty ? "container" : "empty-container"}`}>
        {
          isNotEmpty ? (
            <View className="product-list">
              <View className="product-list-items">
                {products.map((item) => (
                  <View className="product-list-items-item" onClick={this.onNavegateDetail.bind(this,item.id)}>
                    <View>
                      <Image src={(item.thumbnails_url && item.thumbnails_url.length > 0)? item.thumbnails_url[0]:"" } className="product-list-items-item-img"></Image>
                    </View>
                    <View className="product-list-items-item-content">
                      <View className="product-list-items-item-content-body">
                        {item.body}
                      </View>
                      {
                        (item.price && item.price != 0) && (
                          <View className="product-list-items-item-content-price">￥{item.price / 100}</View>
                        )
                      }
                    </View>
                  </View>
                )
                )}
              </View>
            </View>
          ) : (
              <View className="empty-bg">
                <Image src="https://shuoliangju-cn.oss-cn-qingdao.aliyuncs.com/production/config/undraw_product_teardown_elol.png" mode="aspectFit"></Image>
                <View className="empty-bg-tips">还没有创建任何产品图册~</View>
              </View>
            )
        }
        {
          globalData.userInfo.id == this.state.userId && (
            <View className="add-btn" onClick={this.onNavgateToCreateProduct.bind(this)}>
              <Text className="iconfont icon-add-select add" />
            </View>
          )
        }

      </View>
    )
  }
}
export default ProductList
