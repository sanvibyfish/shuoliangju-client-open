/** @format */

import Taro from '@tarojs/taro'
import modelExtend from 'dva-model-extend'
import {baseGroup} from './base-group'

export default modelExtend(baseGroup,{
  namespace: 'group',
  state: {
  },

  effects: {

  },

  reducers: {
    update(state, {payload}) {
      return {...state, ...payload}
    },
  },
})
