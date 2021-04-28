import { baseNotification } from './base-notification';
/** @format */
import * as Api from '../services/messages'
import {message} from './schema'
import {normalize, denormalize} from 'normalizr'

import modelExtend from 'dva-model-extend'

export default modelExtend(baseNotification,{
  namespace: 'likeMessages',
  effects:{
    *getMessages({payload, params}, {call, put, select}) {
      const response = yield call(Api.getLikesMessages, {
        ...payload,
      })
      if (response) {
        const data = normalize(response, [message])
        yield put.resolve({
          type: 'entities/addEntities',
          payload: data.entities,
        })
        yield put({
          type: 'save',
          payload: {
            messages: data.result,
            page: payload.page,
          },
        })
      }
    }
  }
})