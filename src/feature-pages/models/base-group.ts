import modelExtend from 'dva-model-extend'
import { baseModel } from '../../models/base-model'
import * as Api from '../services/group'
import EntityUtils from '../../utils/entity_utils'
import Taro from '@tarojs/taro'
import EventCenter from '../../utils/event-center'

export const baseGroup = modelExtend(baseModel, {

  effects: {
    *createGroup({ payload }, { call, put, select }) {
      const response = yield call(Api.createGroup, {
        ...payload,
      })
      if (response) {
        let data = EntityUtils.setGroup(response)
        yield put.resolve({
          type: 'entities/addEntities',
          payload: data.entities
        })
        yield put({
          type: "actionCreateGroup",
          payload: {},
        })
        Taro.eventCenter.trigger(EventCenter.CREATE_GROUP_SUCCESS)
        return response
      }
    },
    *getGroups({ payload }, { call, put }) {
      const response = yield call(Api.getGroups, {
        ...payload
      })
      if(response) {
        const data = EntityUtils.setGroups(response)
        yield put.resolve({
          type: 'entities/addEntities',
          payload: data.entities,
        })
        yield put({
          type: 'actionGetGroups',
          payload: {
            groupIds: data.result,
            page: payload.page,
            isLast: (response.length == 0 && payload.page > 1) ? true : false,
            reset: payload.page == 1 ? true : false
          },
        })
      }
    },
    *getGroup({ payload }, { call, put }) {
      const response = yield call(Api.getGroup, {
        ...payload
      })
      if (response) {
        const data = EntityUtils.setGroup(response)
        yield put({
          type: 'entities/addEntities',
          payload: data.entities,
        })

        yield put({
          type: 'actionGetGroup',
          payload: {
            groupId: response.id
          },
        })
        return response
      }
    },
    *destroy({payload}, {call, put}) {
      yield call(Api.deleteGroup, {
        ...payload,
      })
      yield put({
        type: 'actionDestroyGroup',
        payload: {
          groupId: payload.id
        },
      })
      Taro.eventCenter.trigger(EventCenter.DESTROY_GROUP,payload.id)
    },
  },

  reducers: {
    actionCreateGroup(state, { payload }) {
      return { ...state, ...payload }
    },
    actionGetGroup(state, {payload}) {
      return {...state, ...payload}
    },
    actionGetGroups(state, {payload}) {
      const {reset} = payload
      if(!reset) {
        payload.groupIds = state.groupIds.concat(payload.groupIds)
      }
      return {...state, ...payload}
    },
  }
})