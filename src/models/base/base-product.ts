import modelExtend from 'dva-model-extend'
import { baseModel } from '../base-model'
import * as Api from '../../services/product'
import EntityUtils from '../../utils/entity_utils'
import Taro from '@tarojs/taro'
import EventCenter from '../../utils/event-center'

export const baseProduct = modelExtend(baseModel, {

  effects: {
    *createProduct({ payload }, { call, put, select }) {
      const response = yield call(Api.createProduct, {
        ...payload,
      })
      if (response) {
        let data = EntityUtils.setProduct(response)
        yield put.resolve({
          type: 'entities/addEntities',
          payload: data.entities
        })
        yield put({
          type: "actionCreateProduct",
          payload: {},
        })
        Taro.eventCenter.trigger(EventCenter.CREATE_PRODUCT_SUCCESS)
        return response
      }
    },
    *getProducts({ payload }, { call, put }) {
      console.log(payload)
      const response = yield call(Api.getProducts, {
        ...payload
      })
      if(response) {
        const data = EntityUtils.setProducts(response)
        console.log(data)
        yield put.resolve({
          type: 'entities/addEntities',
          payload: data.entities,
        })
        yield put({
          type: 'actionGetProducts',
          payload: {
            productIds: data.result,
            page: payload.page,
            isLast: (response.length == 0 && payload.page > 1) ? true : false,
            reset: payload.page == 1 ? true : false
          },
        })
      }
    },
    *getProduct({ payload }, { call, put }) {
      console.log(payload)
      const response = yield call(Api.getProduct, {
        ...payload
      })
      if(response) {
        const data = EntityUtils.setProduct(response)
        console.log(data)
        yield put.resolve({
          type: 'entities/addEntities',
          payload: data.entities,
        })
        yield put({
          type: 'actionGetProduct',
          payload: {
            productId: data.result,
          }
        })
      }
    },
    *destroy({payload}, {call, put}) {
      yield call(Api.deleteProduct, {
        ...payload,
      })
      yield put({
        type: 'actionDestroyProduct',
        payload: {
          productId: payload.id
        },
      })
      Taro.eventCenter.trigger(EventCenter.DESTROY_PRODUCT,payload.id)
      return true
    },
  },

  reducers: {
    actionCreateProduct(state, { payload }) {
      return { ...state, ...payload }
    },
    actionGetProduct(state, { payload }) {
      return { ...state, ...payload }
    },
    actionDestroyProduct(state, { payload }) {
      return { ...state, ...payload }
    },
    actionGetProducts(state, {payload}) {
      const {reset} = payload
      if(!reset) {
        payload.productIds = state.productIds.concat(payload.productIds)
      }
      return {...state, ...payload}
    },
  }
})