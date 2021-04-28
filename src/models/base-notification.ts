import Tips from '../utils/tips'
import * as Api from '../services/messages'
import {Router} from '../config/router'
import {message} from './schema'
import {normalize, denormalize} from 'normalizr'
import Taro from '@tarojs/taro'
import modelExtend from 'dva-model-extend'
import {baseModel} from './base-model'
import EventCenter from '../utils/event-center'
export const baseNotification = modelExtend(baseModel,{
  state: {
    messages: new Array()
  },
  effects: {
    *readMessages({payload, params}, {call, put, select}) {
      const response = yield call(Api.readMessages, {
        ...payload,
      })
      
      if(response) {
        const data = normalize(response, [message])
        yield put.resolve({
          type: 'entities/addEntities',
          payload: data.entities,
        })
        Taro.eventCenter.trigger(EventCenter.READ_MESSAGE_SUCCESS)
        yield put({
          type: 'update'
        })
      }
    },
  },
  reducers: {
    save(state, {payload}) {
      //刷新页面
      if (payload.page == 1) {
        state.isLast = false
        return {...state, ...payload}
      }

      //没有更多了
      if (payload.page != 1 && payload.messages.length == 0) {
        Tips.failure('没有更多了')
        state.isLast = true
        return {...state}
      }

      //加载更多
      if (payload.messages && payload.page != 1) {
        payload.messages = state.messages.concat(payload.messages)
        return {...state, ...payload}
      }
    }
  },
})
