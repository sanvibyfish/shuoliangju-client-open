/** @format */

import Taro from '@tarojs/taro'
import modelExtend from 'dva-model-extend'
import {baseGroup} from './base-group'

export default modelExtend(baseGroup,{
  namespace: 'groupDetail',
  state: {
    groupIds: []
  },

  effects: {

  },

  reducers: {
    actionGetGroup(state, {payload}) {
      return {...state, ...payload}
    },
  },
})
