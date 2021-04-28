import modelExtend from 'dva-model-extend'
import { baseModel } from '../base-model'
import * as Api from '../../services/app'
import EntityUtils from '../../utils/entity_utils'
import Taro from '@tarojs/taro'
import EventCenter from '../../utils/event-center'
import { section } from '../schema'

export const baseApp = modelExtend(baseModel, {

  effects: {
    *qrcodeApp({payload}, {call, put}) {
      const response = yield call(Api.qrcodeApp, {
        ...payload,
      })
      return response
    },
    *getApps({ payload }, { call, put }) {
      const response = yield call(Api.getApps, {
        ...payload
      })
      if(response) {
        const data = EntityUtils.setApps(response)
        console.log(data)
        yield put.resolve({
          type: 'entities/addEntities',
          payload: data.entities,
        })
        yield put({
          type: 'actionGetApps',
          payload: {
            appIds: data.result,
            page: payload.page,
            isLast: (response.length == 0 && payload.page > 1) ? true : false,
            reset: payload.page == 1 ? true : false
          },
        })
      }
    },
    *getApp({ payload }, { call, put, select }) {
      const response = yield call(Api.getApp, {
        ...payload,
      })
      if (response) {
        let data = EntityUtils.setApp(response)
        yield put.resolve({
          type: 'entities/addEntities',
          payload: data.entities
        })
        yield put({
          type: "actionGetApp",
          payload: {
            appId: response.id
          },
        })
        Taro.eventCenter.trigger(EventCenter.CREATE_APP_SUCCESS)
        return true
      }
    },  
    *joinApp({ payload }, { call, put, select }) {
      const response = yield call(Api.joinApp, {
        ...payload,
      })
      if (response) {
        let data = EntityUtils.setApp(response)
        yield put.resolve({
          type: 'entities/addEntities',
          payload: data.entities
        })
        yield put({
          type: "actionJoinApp",
          payload: {
            appId: response.id
          },
        })
        return true
      }
    }, 
    *create({ payload }, { call, put, select }) {
      const response = yield call(Api.createApp, {
        ...payload,
      })
      if (response) {
        let data = EntityUtils.setApp(response)
        yield put.resolve({
          type: 'entities/addEntities',
          payload: data.entities
        })
        yield put({
          type: "actionCreateApp",
          payload: {},
        })
        Taro.eventCenter.trigger(EventCenter.CREATE_APP_SUCCESS)
        return true
      }
    },
    *updateApp({ payload }, { call, put, select }) {
      const response = yield call(Api.updateApp, {
        ...payload,
      })
      if (response) {
        let data = EntityUtils.setApp(response)
        yield put.resolve({
          type: 'entities/addEntities',
          payload: data.entities
        })
        yield put({
          type: "actionUpdateApp",
          payload: {},
        })
        Taro.eventCenter.trigger(EventCenter.UPDATE_APP_SUCCESS)
        return true
      }
    },
    *exitApp({ payload }, { call, put, select }) {
      const response = yield call(Api.exitApp, {
        ...payload,
      })
      if (response) {
        let data = EntityUtils.setApp(response)
        yield put.resolve({
          type: 'entities/addEntities',
          payload: data.entities
        })
        yield put({
          type: "actionExitApp",
          payload: {},
        })
        Taro.eventCenter.trigger(EventCenter.EXIT_APP_SUCCESS)
        return true
      }
    },
  },

  reducers: {
    actionGetApp(state, { payload }) {
      return { ...state, ...payload }
    },
    actionCreateApp(state, { payload }) {
      return { ...state, ...payload }
    },
    actionUpdateApp(state, { payload }) {
      return { ...state, ...payload }
    },
    actionExitApp(state, { payload }) {
      return { ...state, ...payload }
    },
    actionGetApps(state,{ payload }) {
      return { ...state, ...payload }
    },
    actionJoinApp(state, { payload }) {
      return { ...state, ...payload }
    }
  }
})