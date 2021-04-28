/** @format */

import {normalize, denormalize} from 'normalizr'
import * as Api from '../services/user'
import Storage from '../utils/storage'
import {globalData} from '../utils/common'
import {user} from './schema'
import { Router } from '../config/router'
export default {
  namespace: 'profile',
  state: {
    user: null,
    updated: false
  },

  effects: {
    *updateUser({payload}, {call, put}) {
      const response = yield call(Api.update, {
        ...payload,
      })
      if (response) {
        const data = normalize(response, user)
        //save userinfo
        Storage.set(Storage.USER_INFO, response)
        globalData.userInfo = response
        yield put.resolve({
          type: 'entities/addEntities',
          payload: data.entities,
        })
        yield put({
          type: 'update',
          payload: {
            user: response,
          },
        })
        yield put({
          type: 'user/show',
          payload: {
            user: response,
          },
        })
      }
    },
  },

  reducers: {
    update(state, {payload}) {
      Router.back()
      return {...state, ...payload}
    },
  },
}
