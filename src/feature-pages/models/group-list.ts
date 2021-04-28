/** @format */

import Taro from '@tarojs/taro'
import modelExtend from 'dva-model-extend'
import {baseGroup} from './base-group'

export default modelExtend(baseGroup,{
  namespace: 'groupList',
  state: {
    groupIds: []
  },

  effects: {

  },

  reducers: {
    update(state, {payload}) {
      return {...state, ...payload}
    },
    actionDestroyGroup(state, {payload}) {
      const { groupId } = payload
      payload.groupIds = state.groupIds.filter((id)=>{ return id != groupId})
      return {...state, ...payload}
    },
  },
})
