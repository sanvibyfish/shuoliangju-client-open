import Tips from '../utils/tips'
import * as Api from '../services/app'
import Taro from '@tarojs/taro'
import modelExtend from 'dva-model-extend'
import {baseModel} from './base-model'
import EntityUtils from '../utils/entity_utils'

export default modelExtend(baseModel,{
  namespace: "appMembers",
  state: {
    memberIds: new Array()
  },
  effects: {
    *getAppMembers({payload, params}, {call, put, select}) {
      const response = yield call(Api.getAppMembers, {
        ...payload,
      })
      
      if(response) {
        const data = EntityUtils.setUsers(response)
        yield put.resolve({
          type: 'entities/addEntities',
          payload: data.entities,
        })
        yield put({
          type: 'actionGetAppMembers',
          payload: {
            memberIds: data.result,
            page: payload.page,
            isLast: (response.length == 0 && payload.page > 1) ? true : false,
            reset: payload.page == 1 ? true : false
          },
        })
      }
    },
  },
  reducers: {
    actionGetAppMembers(state, {payload}) {
      const {reset} = payload
      if(!reset) {
        payload.memberIds = state.memberIds.concat(payload.memberIds)
      }
      return {...state, ...payload}
    },
  },
})
