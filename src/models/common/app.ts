/** @format */

import Taro from '@tarojs/taro'
import modelExtend from 'dva-model-extend'
import {baseApp} from '../base/base-app'
import * as Api from '../../services/app'

export default modelExtend(baseApp,{
  namespace: 'app',
  state: {
  },

  effects: {
    *getConfig({ payload }, { call, put, select }) {
      const response = yield call(Api.getConfig, {
        ...payload,
      })
      yield put({
        type: 'update',
      })
      return response
    },
  },

  reducers: {
    update(state, {payload}) {
      return {...state, ...payload}
    },
  },
})
